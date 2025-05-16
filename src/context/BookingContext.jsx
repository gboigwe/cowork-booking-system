import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [desks, setDesks] = useLocalStorage('desks', initializeDesks());
  const [bookings, setBookings] = useLocalStorage('bookings', []);
  const [selectedDesk, setSelectedDesk] = useState(null);
  
  function initializeDesks() {
    const individualDesks = Array(10).fill().map((_, index) => ({
      id: `individual-${index + 1}`,
      name: `Individual Desk ${index + 1}`,
      type: 'individual',
      isAvailable: true
    }));
    
    const teamDesks = Array(5).fill().map((_, index) => ({
      id: `team-${index + 1}`,
      name: `Team Desk ${index + 1}`,
      type: 'team',
      isAvailable: true
    }));
    
    return [...individualDesks, ...teamDesks];
  }
  
  const selectDesk = (deskId) => {
    const desk = desks.find(desk => desk.id === deskId);
    setSelectedDesk(desk);
  };
  
  const getPricing = (deskType, membershipTier) => {
    if (deskType === 'team') return 25;
    
    const pricing = {
      basic: 10,
      premium: 15,
      executive: 20
    };
    
    return pricing[membershipTier];
  };
  
  const calculateTotal = (hours, deskType, membershipTier) => {
    const hourlyRate = getPricing(deskType, membershipTier);
    return hourlyRate * hours;
  };
  
  const createBooking = (bookingData) => {
    const { hours, membershipTier } = bookingData;
    
    if (!selectedDesk) return;
    
    const newBooking = {
      id: generateId(),
      deskId: selectedDesk.id,
      deskName: selectedDesk.name,
      deskType: selectedDesk.type,
      membershipTier: selectedDesk.type === 'individual' ? membershipTier : null,
      hours,
      totalCost: calculateTotal(hours, selectedDesk.type, membershipTier),
      createdAt: new Date().toISOString()
    };
    
    setBookings([...bookings, newBooking]);
    
    setDesks(desks.map(desk => 
      desk.id === selectedDesk.id ? { ...desk, isAvailable: false } : desk
    ));
    
    setSelectedDesk(null);
    
    return newBooking;
  };
  
  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    setDesks(desks.map(desk => 
      desk.id === booking.deskId ? { ...desk, isAvailable: true } : desk
    ));
    
    setBookings(bookings.filter(b => b.id !== bookingId));
  };
  
  const value = {
    desks,
    bookings,
    selectedDesk,
    selectDesk,
    createBooking,
    cancelBooking,
    calculateTotal,
    getPricing
  };
  
  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
