export type DeskType = 'individual' | 'team';
export type MembershipTier = 'basic' | 'premium' | 'executive';

export interface Desk {
  id: string;
  name: string;
  type: DeskType;
  position_index: number;
}

export interface DeskAvailability extends Desk {
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  deskId: string;
  deskName: string;
  deskType: DeskType;
  membershipTier: MembershipTier | null;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalCost: number;
  createdAt: string;
}

export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageHours: number;
  popularDesk: string;
  tierBreakdown: Record<string, number>;
  dailyBookings: { date: string; count: number }[];
}
