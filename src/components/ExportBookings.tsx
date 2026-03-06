import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { formatDate } from '../utils/helpers';

function ExportBookings() {
  const { bookings } = useBooking();
  const [exported, setExported] = useState(false);

  const generateCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Booking ID', 'Desk Name', 'Desk Type', 'Membership Tier', 'Date', 'Start', 'End', 'Hours', 'Total Cost', 'Booked On'];
    const csvRows = bookings.map(b => [
      b.id, b.deskName, b.deskType, b.membershipTier || 'N/A',
      b.date, b.startTime, b.endTime, b.hours, b.totalCost, formatDate(b.createdAt)
    ]);
    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <motion.button
      onClick={generateCSV}
      disabled={bookings.length === 0}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
        exported
          ? 'bg-green-500/20 border border-green-400/30 text-green-300'
          : 'bg-white/10 backdrop-blur-xl border border-white/20 text-blue-200 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100'
      }`}
      whileTap={{ scale: 0.97 }}
    >
      {exported ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Exported!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </>
      )}
    </motion.button>
  );
}

export default ExportBookings;
