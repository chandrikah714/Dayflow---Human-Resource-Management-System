// TEMP/MOCK — stands in for GET /api/employees until the Spring Boot
// backend phase exists. Shape mirrors the planned API response so swapping
// this for a real fetch later shouldn't require touching the components
// that consume it — just the data-fetching hook.
export const mockEmployees = [
  {
    id: 'OE2410C0001',
    name: 'Priya Sharma',
    role: 'Frontend Engineer',
    department: 'Engineering',
    avatar: null,
    status: 'present',
    borderColor: '#7c6cf0',
  },
  {
    id: 'OE2410C0002',
    name: 'Arjun Mehta',
    role: 'HR Officer',
    department: 'People Ops',
    avatar: null,
    status: 'present',
    borderColor: '#37e6c4',
  },
  {
    id: 'OE2410C0003',
    name: 'Sara Khan',
    role: 'Backend Engineer',
    department: 'Engineering',
    avatar: null,
    status: 'leave',
    borderColor: '#f0997b',
  },
  {
    id: 'OE2410C0004',
    name: 'Devika Nair',
    role: 'Product Designer',
    department: 'Design',
    avatar: null,
    status: 'present',
    borderColor: '#6c5ce0',
  },
  {
    id: 'OE2410C0005',
    name: 'Rohan Iyer',
    role: 'QA Engineer',
    department: 'Engineering',
    avatar: null,
    status: 'absent',
    borderColor: '#e4584f',
  },
  {
    id: 'OE2410C0006',
    name: 'Meera Pillai',
    role: 'Payroll Admin',
    department: 'Finance',
    avatar: null,
    status: 'present',
    borderColor: '#3fb27f',
  },
];

export const mockCurrentUser = {
  id: 'OE2410C0001',
  name: 'Priya Sharma',
  role: 'Employee', // 'Employee' | 'Admin'
  avatar: null,
};
