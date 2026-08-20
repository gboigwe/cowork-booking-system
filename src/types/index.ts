export type DeskSide = 'left' | 'right';
export type PayMethod = 'online' | 'venue';

export interface Desk {
  id: string;
  side: DeskSide;
  desc: string;
  position: number;
}

export interface DeskAvailability extends Desk {
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  deskId: string;
  deskName: string;
  deskDesc: string;
  date: string;
  holderName: string;
  holderPhone: string;
  payMethod: PayMethod;
  amount: number;
  createdAt: string;
}

export interface AdminOverview {
  desks: DeskAvailability[];
  todaysBookings: Booking[];
  totalBookings: number;
  totalRevenue: number;
}
