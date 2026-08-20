import type { Booking, DeskAvailability, PayMethod, AdminOverview } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getDesks: (date?: string) =>
    request<DeskAvailability[]>(`/desks${date ? `?date=${date}` : ''}`),

  getBookings: (phone?: string) =>
    request<Booking[]>(`/bookings${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`),

  createBooking: (data: {
    deskId: string;
    date: string;
    holderName: string;
    holderPhone: string;
    payMethod: PayMethod;
  }) =>
    request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelBooking: (id: string) =>
    request<{ success: boolean }>(`/bookings/${id}`, { method: 'DELETE' }),

  sendOtp: (phone: string) =>
    request<{ sent: boolean }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    request<{ verified: boolean }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  adminLogin: (password: string) =>
    request<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  adminOverview: (token: string) =>
    request<AdminOverview>('/admin/overview', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    }),

  adminToggleBlock: (deskId: string, token: string) =>
    request<{ success: boolean }>(`/admin/desks/${deskId}/block`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    }),
};
