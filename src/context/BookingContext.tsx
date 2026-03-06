import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Booking, DeskAvailability, MembershipTier, DeskType } from '../types';
import { api } from '../utils/api';
import { getTodayString } from '../utils/helpers';

interface BookingContextType {
  desks: DeskAvailability[];
  bookings: Booking[];
  selectedDesk: DeskAvailability | null;
  loading: boolean;
  selectDesk: (deskId: string) => void;
  createBooking: (data: {
    date: string;
    startTime: string;
    endTime: string;
    membershipTier: MembershipTier;
  }) => Promise<Booking | undefined>;
  cancelBooking: (bookingId: string) => Promise<void>;
  calculateTotal: (hours: number, deskType: DeskType, membershipTier: MembershipTier) => number;
  getPricing: (deskType: DeskType, membershipTier: MembershipTier) => number;
  refreshDesks: (date?: string, startTime?: string, endTime?: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [desks, setDesks] = useState<DeskAvailability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<DeskAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshDesks = useCallback(async (date?: string, startTime?: string, endTime?: string) => {
    try {
      let data: DeskAvailability[];
      if (date && startTime && endTime) {
        data = await api.getDeskAvailability(date, startTime, endTime);
      } else {
        data = await api.getDesks(date || getTodayString());
      }
      setDesks(data);
    } catch (err) {
      console.error('Failed to fetch desks:', err);
    }
  }, []);

  const refreshBookings = useCallback(async () => {
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshDesks(), refreshBookings()]);
      setLoading(false);
    };
    init();
  }, [refreshDesks, refreshBookings]);

  const selectDesk = (deskId: string) => {
    const desk = desks.find(d => d.id === deskId) || null;
    setSelectedDesk(desk);
  };

  const getPricing = (deskType: DeskType, membershipTier: MembershipTier): number => {
    if (deskType === 'team') return 25;
    const pricing: Record<MembershipTier, number> = { basic: 10, premium: 15, executive: 20 };
    return pricing[membershipTier];
  };

  const calculateTotal = (hours: number, deskType: DeskType, membershipTier: MembershipTier): number => {
    return getPricing(deskType, membershipTier) * hours;
  };

  const createBooking = async (data: {
    date: string;
    startTime: string;
    endTime: string;
    membershipTier: MembershipTier;
  }): Promise<Booking | undefined> => {
    if (!selectedDesk) return;
    try {
      const booking = await api.createBooking({
        deskId: selectedDesk.id,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        membershipTier: data.membershipTier,
      });
      await Promise.all([refreshDesks(), refreshBookings()]);
      setSelectedDesk(null);
      return booking;
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    try {
      await api.cancelBooking(bookingId);
      await Promise.all([refreshDesks(), refreshBookings()]);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  return (
    <BookingContext.Provider value={{
      desks, bookings, selectedDesk, loading,
      selectDesk, createBooking, cancelBooking,
      calculateTotal, getPricing, refreshDesks, refreshBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
