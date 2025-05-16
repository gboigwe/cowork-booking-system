import React from 'react';
import { useBooking } from '../context/BookingContext';
import { formatDate } from '../utils/helpers';

function ExportBookings() {
  const { bookings } = useBooking();
  
  const generateCSV = () => {
    if (bookings.length === 0) {
      alert('No bookings to export!');
      return;
    }
    
    // Define CSV headers
    const headers = [
      'Booking ID',
      'Desk Name',
      'Desk Type',
      'Membership Tier',
      'Hours',
      'Total Cost',
      'Date'
    ];
    
    // Generate CSV rows
    const csvRows = bookings.map(booking => [
      booking.id,
      booking.deskName,
      booking.deskType,
      booking.membershipTier || 'N/A',
      booking.hours,
      booking.totalCost,
      formatDate(booking.createdAt)
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="export-section">
      <button 
        className="btn-export"
        onClick={generateCSV}
        disabled={bookings.length === 0}
      >
        Export Bookings to CSV
      </button>
    </div>
  );
}

export default ExportBookings;
