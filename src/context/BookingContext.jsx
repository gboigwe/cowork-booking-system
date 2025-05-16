import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  // Initialize desks from localStorage or create new ones
  const [desks, setDesks] = useState(() => {
    const savedDesks = localStorage.getItem('coworking-desks');
    
    if (savedDesks) {
      return JSON.parse(savedDesks);
    } else {
      // Create initial desks
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
  });
  
  // Initialize bookings from localStorage or create empty array
  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem('coworking-bookings');
    return savedBookings ? JSON.parse(savedBookings) : [];
  });
  
  // Selected desk for booking
  const [selectedDesk, setSelectedDesk] = useState(null);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('coworking-desks', JSON.stringify(desks));
  }, [desks]);
  
  useEffect(() => {
    localStorage.setItem('coworking-bookings', JSON.stringify(bookings));
  }, [bookings]);
  
  // Function to select a desk
  const selectDesk = (deskId) => {
    const desk = desks.find(desk => desk.id === deskId);
    setSelectedDesk(desk);
  };
  
  // Get pricing based on desk type and membership tier
  const getPricing = (deskType, membershipTier) => {
    if (deskType === 'team') return 25;
    
    const pricing = {
      basic: 10,
      premium: 15,
      executive: 20
    };
    
    return pricing[membershipTier];
  };
  
  // Calculate total cost for a booking
  const calculateTotal = (hours, deskType, membershipTier) => {
    const hourlyRate = getPricing(deskType, membershipTier);
    return hourlyRate * hours;
  };
  
  // Create a new booking
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
    
    // Update bookings state
    setBookings([...bookings, newBooking]);
    
    // Update desk availability
    setDesks(desks.map(desk => 
      desk.id === selectedDesk.id ? { ...desk, isAvailable: false } : desk
    ));
    
    // Reset selection
    setSelectedDesk(null);
    
    return newBooking;
  };
  
  // Cancel an existing booking
  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    // Update desk availability
    setDesks(desks.map(desk => 
      desk.id === booking.deskId ? { ...desk, isAvailable: true } : desk
    ));
    
    // Remove booking
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
