import type { Desk, Booking, AnalyticsData, DeskAvailability } from '../types';

const API_BASE = '/api';

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

  getDeskAvailability: (date: string, startTime: string, endTime: string) =>
    request<DeskAvailability[]>(
      `/desks/availability?date=${date}&startTime=${startTime}&endTime=${endTime}`
    ),

  getBookings: () =>
    request<Booking[]>('/bookings'),

  createBooking: (data: {
    deskId: string;
    date: string;
    startTime: string;
    endTime: string;
    membershipTier: string;
  }) =>
    request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelBooking: (id: string) =>
    request<{ success: boolean }>(`/bookings/${id}`, { method: 'DELETE' }),

  getAnalytics: () =>
    request<AnalyticsData>('/analytics'),
};
