import React from 'react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils/helpers';

function BookingSummary() {
  const { bookings, cancelBooking } = useBooking();
  
  if (bookings.length === 0) {
    return (
      <section className="booking-summary-section">
        <h2>Your Bookings</h2>
        <div className="empty-bookings">
          <p>You don't have any bookings yet.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="booking-summary-section">
      <h2>Your Bookings</h2>
      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.deskName}</h3>
              <span className="booking-type">
                {booking.deskType === 'individual' ? 'Individual' : 'Team'}
              </span>
            </div>
            
            <div className="booking-details">
              {booking.deskType === 'individual' && (
                <div className="booking-detail">
                  <span>Membership:</span>
                  <span className="capitalize">{booking.membershipTier}</span>
                </div>
              )}
              
              <div className="booking-detail">
                <span>Duration:</span>
                <span>{booking.hours} hour{booking.hours > 1 ? 's' : ''}</span>
              </div>
              
              <div className="booking-detail">
                <span>Total Cost:</span>
                <span>{formatCurrency(booking.totalCost)}</span>
              </div>
              
              <div className="booking-detail">
                <span>Booked on:</span>
                <span>{formatDate(booking.createdAt)}</span>
              </div>
            </div>
            
            <button 
              className="btn-cancel" 
              onClick={() => cancelBooking(booking.id)}
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BookingSummary;
