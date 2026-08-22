import { createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { Router, type IRouter } from "express";

type Role = "EMPLOYEE" | "HR";
type User = {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone: string | null;
  address: string | null;
  profilePicture: string | null;
  createdAt: string;
};

const users: User[] = [];
const secret = process.env["SESSION_SECRET"] ?? "dayflow-development-secret";
let nextId = 1;

function passwordHash(password: string) {
  const salt = randomUUID();
  return `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
}

function passwordMatches(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = scryptSync(password, salt, 32);
  const actual = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function tokenFor(user: User) {
  const payload = Buffer.from(JSON.stringify({ sub: user.email, role: user.role })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function userProfile(user: User) {
  return {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
  };
}

function authenticatedUser(req: { headers: { authorization?: string } }) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, "");
  if (!token) return undefined;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return undefined;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (signature !== expected) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { sub?: string };
    return users.find((user) => user.email === parsed.sub);
  } catch {
    return undefined;
  }
}

const router: IRouter = Router();

router.post("/auth/register", (req, res) => {
  const { employeeId, name, email, password, role } = req.body as Partial<{
    employeeId: string; name: string; email: string; password: string; role: Role;
  }>;
  const normalizedEmail = email?.trim().toLowerCase();
  if (!employeeId?.trim() || !name?.trim() || !normalizedEmail || !password || password.length < 8 || !role) {
    return res.status(400).json({ error: "Employee ID, name, email, role, and a password of at least 8 characters are required." });
  }
  if (!["EMPLOYEE", "HR"].includes(role)) return res.status(400).json({ error: "Role must be EMPLOYEE or HR." });
  if (users.some((user) => user.email === normalizedEmail)) return res.status(409).json({ error: "An account with this email already exists." });
  if (users.some((user) => user.employeeId === employeeId.trim())) return res.status(409).json({ error: "This employee ID is already registered." });
  const user: User = {
    id: nextId++, employeeId: employeeId.trim(), name: name.trim(), email: normalizedEmail,
    passwordHash: passwordHash(password), role, phone: null, address: null, profilePicture: null, createdAt: new Date().toISOString(),
  };
  users.push(user);
  return res.status(201).json({ token: tokenFor(user), user: userProfile(user) });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body as Partial<{ email: string; password: string }>;
  const user = users.find((candidate) => candidate.email === email?.trim().toLowerCase());
  if (!user || !password || !passwordMatches(password, user.passwordHash)) return res.status(401).json({ error: "Invalid email or password." });
  return res.json({ token: tokenFor(user), user: userProfile(user) });
});

router.get("/employee/profile", (req, res) => {
  const user = authenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Authentication required." });
  return res.json(userProfile(user));
});

router.put("/employee/profile", (req, res) => {
  const user = authenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Authentication required." });
  const { phone, address, profilePicture } = req.body as Partial<Pick<User, "phone" | "address" | "profilePicture">>;
  user.phone = phone ?? null;
  user.address = address ?? null;
  user.profilePicture = profilePicture ?? null;
  return res.json(userProfile(user));
});

export default router;