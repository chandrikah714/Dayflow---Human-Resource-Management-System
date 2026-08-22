// Central API client.
//
// Every function here first tries a real HTTP request against your Spring
// Boot backend (base URL from VITE_API_BASE_URL). If that request fails
// because no backend is running yet (connection refused / network error),
// it transparently falls back to the mock data in mock-data.js so the UI
// stays fully usable during frontend development.
//
// Once your backend is live, set VITE_API_BASE_URL in a .env file and this
// fallback simply stops triggering — no component code needs to change.
// See README.md for the exact endpoint contract expected here.

import { getToken } from './auth';
import * as mock from './mock-data';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch {
      // response wasn't JSON — keep default message
    }
    const error = new Error(message);
    error.status = response.status;
    error.isApiError = true; // reached the real backend, don't fall back to mock
    throw error;
  }

  return response.json();
}

// Wraps a real-request attempt with a mock fallback, but only for network-
// level failures (backend unreachable) — real API errors (4xx/5xx) surface
// to the UI normally so validation messages etc. still work.
async function withFallback(realCall, mockCall) {
  try {
    return await realCall();
  } catch (err) {
    if (err.isApiError) throw err;
    return mockCall();
  }
}

export const api = {
  login: (credentials) =>
    withFallback(
      () => request('/auth/login', { method: 'POST', body: credentials }),
      () => mock.mockLogin(credentials),
    ),

  register: (payload) =>
    withFallback(
      () => request('/auth/register', { method: 'POST', body: payload }),
      () => mock.mockRegister(payload),
    ),

  getProfile: () =>
    withFallback(
      () => request('/employee/profile'),
      () => mock.mockGetProfile(),
    ),

  updateProfile: (partial) =>
    withFallback(
      () => request('/employee/profile', { method: 'PUT', body: partial }),
      () => mock.mockUpdateProfile(partial),
    ),

  getAttendance: () =>
    withFallback(
      () => request('/employee/attendance'),
      () => mock.mockGetAttendance(),
    ),

  getLeaveRequests: () =>
    withFallback(
      () => request('/employee/leave-requests'),
      () => mock.mockGetLeaveRequests(),
    ),

  createLeaveRequest: (payload) =>
    withFallback(
      () => request('/employee/leave-requests', { method: 'POST', body: payload }),
      () => mock.mockCreateLeaveRequest(payload),
    ),
};
