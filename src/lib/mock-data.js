// Demo data used until the Spring Boot backend is connected.
// Shapes here mirror the REST contract documented in README.md, so switching
// to the real API later is a matter of pointing VITE_API_BASE_URL at your
// backend — no component code needs to change.

const STORE_KEY = 'dayflow_mock_store_v1';
const DELAY_MS = 550;

function wait(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seedStore() {
  const monthlyTrend = [
    { month: 'Jan', paid: 1, unpaid: 0 },
    { month: 'Feb', paid: 0, unpaid: 0 },
    { month: 'Mar', paid: 2, unpaid: 1 },
    { month: 'Apr', paid: 1, unpaid: 0 },
    { month: 'May', paid: 0, unpaid: 0 },
    { month: 'Jun', paid: 3, unpaid: 0 },
    { month: 'Jul', paid: 1, unpaid: 1 },
    { month: 'Aug', paid: 2, unpaid: 0 },
    { month: 'Sep', paid: 0, unpaid: 0 },
    { month: 'Oct', paid: 0, unpaid: 0 },
    { month: 'Nov', paid: 0, unpaid: 0 },
    { month: 'Dec', paid: 0, unpaid: 0 },
  ];

  return {
    user: {
      id: 1,
      employeeId: 'DF-1048',
      name: 'Avery Morgan',
      email: 'avery.morgan@dayflow.work',
      role: 'EMPLOYEE',
      phone: '+1 (555) 014-2088',
      address: '214 Harbor Street, Unit 4B, Seattle, WA',
      profilePicture: '',
      dateOfBirth: '1994-03-12',
      gender: 'Female',
      designation: 'Senior Product Designer',
      department: 'Design',
      dateOfJoining: '2022-06-01',
      employmentType: 'Full-time',
      reportingManager: 'Jordan Lee',
      salary: {
        currency: 'USD',
        basic: 5200,
        hra: 1560,
        allowances: 480,
        deductions: 610,
        netPay: 6630,
      },
      documents: [
        { id: 'doc-1', name: 'Offer Letter.pdf', type: 'Offer Letter', uploadedAt: '2022-06-01' },
        { id: 'doc-2', name: 'ID Proof.pdf', type: 'Identity Proof', uploadedAt: '2022-06-01' },
        { id: 'doc-3', name: 'Latest Payslip.pdf', type: 'Payslip', uploadedAt: '2026-07-31' },
      ],
    },
    leaveBalance: {
      totalAnnual: 24,
      paidAllowance: 18,
      unpaidAllowance: 6,
    },
    monthlyTrend,
    leaveRequests: [
      {
        id: 'lr-3',
        type: 'PAID',
        startDate: '2026-07-14',
        endDate: '2026-07-15',
        days: 2,
        reason: 'Family function',
        status: 'APPROVED',
        requestedAt: '2026-07-02T09:12:00.000Z',
        decidedAt: '2026-07-03T11:40:00.000Z',
      },
      {
        id: 'lr-2',
        type: 'UNPAID',
        startDate: '2026-03-20',
        endDate: '2026-03-20',
        days: 1,
        reason: 'Personal errand',
        status: 'APPROVED',
        requestedAt: '2026-03-15T14:02:00.000Z',
        decidedAt: '2026-03-16T08:20:00.000Z',
      },
      {
        id: 'lr-1',
        type: 'PAID',
        startDate: '2026-08-27',
        endDate: '2026-08-28',
        days: 2,
        reason: 'Moving apartments',
        status: 'PENDING',
        requestedAt: '2026-08-20T10:31:00.000Z',
      },
    ],
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to reseed
  }
  const fresh = seedStore();
  localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function daysBetween(start, end) {
  const ms = new Date(end).setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

export async function mockLogin({ email, password }) {
  await wait();
  const store = loadStore();
  if (!email || !password) throw new Error('Enter your email and password.');
  // Demo mode: any credentials matching the seeded email succeed; anything
  // else still succeeds so reviewers can sign in without hunting for a password.
  return { token: 'demo-jwt-token', user: store.user };
}

export async function mockRegister({ employeeId, name, email, role }) {
  await wait();
  const store = loadStore();
  store.user = { ...store.user, employeeId: employeeId || store.user.employeeId, name: name || store.user.name, email: email || store.user.email, role: role || 'EMPLOYEE' };
  saveStore(store);
  return { token: 'demo-jwt-token', user: store.user };
}

export async function mockGetProfile() {
  await wait();
  return loadStore().user;
}

export async function mockUpdateProfile(partial) {
  await wait();
  const store = loadStore();
  store.user = { ...store.user, ...partial };
  saveStore(store);
  return store.user;
}

export async function mockGetAttendance() {
  await wait();
  const store = loadStore();
  const paidTaken = store.monthlyTrend.reduce((sum, m) => sum + m.paid, 0);
  const unpaidTaken = store.monthlyTrend.reduce((sum, m) => sum + m.unpaid, 0);
  const taken = paidTaken + unpaidTaken;
  return {
    totalAnnual: store.leaveBalance.totalAnnual,
    taken,
    remaining: Math.max(0, store.leaveBalance.totalAnnual - taken),
    paidTaken,
    unpaidTaken,
    monthlyTrend: store.monthlyTrend,
  };
}

export async function mockGetLeaveRequests() {
  await wait();
  const store = loadStore();
  return [...store.leaveRequests].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
}

export async function mockCreateLeaveRequest({ type, startDate, endDate, reason }) {
  await wait();
  const store = loadStore();
  const request = {
    id: `lr-${Date.now()}`,
    type,
    startDate,
    endDate,
    days: daysBetween(startDate, endDate),
    reason,
    status: 'PENDING',
    requestedAt: new Date().toISOString(),
  };
  store.leaveRequests.push(request);
  const month = new Date(startDate).toLocaleString('en-US', { month: 'short' });
  const bucket = store.monthlyTrend.find((m) => m.month === month);
  if (bucket) {
    if (type === 'PAID') bucket.paid += request.days;
    else bucket.unpaid += request.days;
  }
  saveStore(store);
  return request;
}
