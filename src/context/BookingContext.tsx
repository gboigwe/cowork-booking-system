import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Booking, DeskAvailability } from '../types';
import { api } from '../utils/api';
import { getTodayString } from '../utils/helpers';

// Standard price is ₦4,000; temporarily testing ₦2,500. Switch back by
// swapping which line is active.
// export const DAY_RATE_NGN = 4000;
export const DAY_RATE_NGN = 2500;

interface BookingContextType {
  desks: DeskAvailability[];
  bookings: Booking[];
  selectedDesk: DeskAvailability | null;
  loading: boolean;
  selectDesk: (deskId: string) => void;
  clearSelectedDesk: () => void;
  createBooking: (data: {
    date: string;
    holderName: string;
    holderPhone: string;
  }) => Promise<Booking | undefined>;
  cancelBooking: (bookingId: string) => Promise<void>;
  refreshDesks: (date?: string) => Promise<void>;
  refreshBookings: (phone?: string) => Promise<void>;
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

  const refreshDesks = useCallback(async (date?: string) => {
    try {
      const data = await api.getDesks(date || getTodayString());
      setDesks(data);
    } catch (err) {
      console.error('Failed to fetch desks:', err);
    }
  }, []);

  const refreshBookings = useCallback(async (phone?: string) => {
    try {
      const data = await api.getBookings(phone);
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshDesks();
      setLoading(false);
    };
    init();
  }, [refreshDesks]);

  const selectDesk = (deskId: string) => {
    const desk = desks.find(d => d.id === deskId) || null;
    setSelectedDesk(desk);
  };

  const clearSelectedDesk = () => setSelectedDesk(null);

  const createBooking = async (data: {
    date: string;
    holderName: string;
    holderPhone: string;
  }): Promise<Booking | undefined> => {
    if (!selectedDesk) return;
    try {
      const booking = await api.createBooking({
        deskId: selectedDesk.id,
        date: data.date,
        holderName: data.holderName,
        holderPhone: data.holderPhone,
      });
      await refreshDesks(data.date);
      setSelectedDesk(null);
      return booking;
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    try {
      await api.cancelBooking(bookingId);
      await refreshDesks();
      // Callers that know the holder's phone should re-run refreshBookings(phone)
      // themselves afterward; GET /bookings requires a phone and won't list everyone's.
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  return (
    <BookingContext.Provider value={{
      desks, bookings, selectedDesk, loading,
      selectDesk, clearSelectedDesk, createBooking, cancelBooking,
      refreshDesks, refreshBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
