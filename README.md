# Dayflow — Employee Dashboard

React + Vite + Tailwind frontend for the Dayflow HRMS employee workspace: sign in/sign up with role selection, profile view/edit, attendance with a monthly leave trend chart, a leave request form, and leave status history.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

There's nothing else to configure — the app runs entirely on **built-in demo data** stored in your browser's `localStorage`, so you can click through every screen (sign up, edit profile, submit a leave request, watch it show up as "Pending") without any backend running.

## Connecting your Spring Boot backend

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend, e.g.:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
2. Restart `npm run dev`.

Every screen calls `src/lib/api.js` first. If your backend responds, its data is used. If the backend is unreachable (network error), the app **automatically falls back to demo data** — so frontend and backend teams can work independently. Once your backend is live and responding, the fallback simply never triggers.

### Expected endpoints

Adjust field names in `src/lib/api.js` / the page components if your backend's JSON shape differs — everything is read in one place per endpoint.

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/auth/register` | `{ employeeId, name, email, password, role }` | `{ token, user }` |
| GET | `/employee/profile` | — | `User` (see below) |
| PUT | `/employee/profile` | `{ phone, address, profilePicture, ... }` | updated `User` |
| GET | `/employee/attendance` | — | `{ totalAnnual, taken, remaining, paidTaken, unpaidTaken, monthlyTrend: [{ month, paid, unpaid }] }` |
| GET | `/employee/leave-requests` | — | `LeaveRequest[]` |
| POST | `/employee/leave-requests` | `{ type, startDate, endDate, reason }` | created `LeaveRequest` |

All authenticated requests send `Authorization: Bearer <token>` using the token returned from login/register.

**`User` shape:**
```ts
{
  id, employeeId, name, email, role, // "EMPLOYEE" | "ADMIN"
  phone, address, profilePicture,
  dateOfBirth, gender,
  designation, department, dateOfJoining, employmentType, reportingManager,
  salary: { currency, basic, hra, allowances, deductions, netPay },
  documents: [{ id, name, type, uploadedAt }],
}
```

**`LeaveRequest` shape:**
```ts
{
  id, type,        // "PAID" | "UNPAID"
  startDate, endDate, days, reason,
  status,           // "PENDING" | "APPROVED" | "REJECTED"
  requestedAt, decidedAt,
}
```

## Project structure

```
src/
  components/
    ui/            Button, Input, Textarea, Select, Card, Badge, Label
    DashboardShell.jsx   Sidebar layout (Profile, Attendance, Request leave, Leave status, Logout)
    AuthLayout.jsx       Split-screen layout for Login/Register
    DayflowBrand.jsx
  lib/
    auth.js         Token/user storage (localStorage)
    api.js          Fetch client with automatic demo-data fallback
    mock-data.js     Seeded demo data + mock resolvers
    utils.js         cn() class merge helper
  pages/
    Login.jsx, Register.jsx
    Profile.jsx      View/edit: personal, job, salary, documents, picture
    Attendance.jsx    Leave balance + monthly paid/unpaid trend chart
    LeaveRequest.jsx  Submit a leave request
    LeaveStatus.jsx   History with Pending/Approved/Rejected
```

## Notes

- **Role-based editing**: employees can edit phone, address, and profile picture. Admin accounts (`role: "ADMIN"`) additionally see designation/department fields unlocked in the edit form — extend this in `Profile.jsx` as your backend's permission rules require.
- **Styling**: matches the existing Dayflow brand (warm cream background, deep teal primary, terracotta accent, DM Sans / Instrument Serif / DM Mono) already used in the auth/profile pages from the other Dayflow repos, so it drops into the same product family.
- **No image/style reference was attached** when this was generated — if you send over the mockup image, share it and the visual details can be refined to match exactly.
