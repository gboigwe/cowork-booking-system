import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { generateTicketPDF } from '../utils/ticket';
import type { Booking } from '../types';

/* ─── Ticket Name Modal ─── */
function TicketModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [name, setName] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setGenerating(true);
    await generateTicketPDF(booking, name.trim());
    setGenerating(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Download Ticket</h3>
            <p className="text-xs text-blue-200/50">{booking.deskName} &middot; {booking.date}</p>
          </div>
        </div>

        <label htmlFor="ticketName" className="block text-sm font-semibold text-blue-100/80 mb-1.5">Your Name</label>
        <input
          id="ticketName" type="text" value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Enter your full name"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 outline-none transition-all text-white placeholder:text-white/30 mb-4"
          autoFocus
        />

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-blue-100/80 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={handleGenerate} disabled={!name.trim() || generating}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {generating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════ */
/*           BOOKING SUMMARY              */
/* ═══════════════════════════════════════ */

function BookingSummary() {
  const { bookings, cancelBooking } = useBooking();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    await cancelBooking(bookingId);
    setCancellingId(null);
    setConfirmId(null);
  };

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <motion.div
          className="w-28 h-28 mx-auto mb-6 relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="absolute inset-0 bg-blue-500/20 rounded-3xl rotate-6 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-blue-400/10 rounded-3xl -rotate-3 backdrop-blur-sm" />
          <div className="relative w-full h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/15 flex items-center justify-center shadow-2xl">
            <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
          </div>
        </motion.div>

        <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
        <p className="text-blue-100/50 mb-8 max-w-sm mx-auto">
          Your desk reservations will appear here. Book your first space and get to work!
        </p>
        <Link to="/booking"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-105">
          Book a Desk
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 transition-all duration-500 overflow-hidden"
            >
              {/* Gradient top stripe */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500" />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{booking.deskName}</h3>
                      <span className="text-xs text-blue-200/50 capitalize">{booking.deskType} desk</span>
                    </div>
                  </div>
                  {booking.membershipTier && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize border ${
                      booking.membershipTier === 'executive'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : booking.membershipTier === 'premium'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-white/10 text-blue-200/70 border-white/15'
                    }`}>
                      {booking.membershipTier}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-blue-400/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <span className="text-blue-100/70">{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-blue-400/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-blue-100/70">{booking.startTime} - {booking.endTime} ({booking.hours}h)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between py-3 px-4 bg-white/5 border border-white/10 rounded-xl mb-4">
                  <span className="text-sm font-medium text-blue-100/60">Total</span>
                  <span className="text-lg font-extrabold text-blue-300">{formatCurrency(booking.totalCost)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button onClick={() => setTicketBooking(booking)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 hover:text-blue-200 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                    Ticket
                  </button>

                  <AnimatePresence mode="wait">
                    {confirmId === booking.id ? (
                      <motion.div key="confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2">
                        <button onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id}
                          className="text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 bg-red-500/20 rounded-lg border border-red-500/30 transition-colors">
                          {cancellingId === booking.id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          className="text-xs font-medium text-blue-200/60 hover:text-blue-200 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 transition-colors">
                          Keep
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button key="cancel" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setConfirmId(booking.id)}
                        className="text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                        Cancel
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-xs text-blue-200/30 mt-2">Booked {formatDate(booking.createdAt)}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {ticketBooking && (
          <TicketModal booking={ticketBooking} onClose={() => setTicketBooking(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default BookingSummary;
