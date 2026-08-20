import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { api } from '../utils/api';
import { formatDayDate, getTodayString } from '../utils/helpers';
import { generateTicketPDF } from '../utils/ticket';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import type { Booking } from '../types';

const inputClass = 'w-full px-4 py-3.5 border border-zonein-border rounded-lg text-[15px] font-sans outline-none focus:border-zonein-green transition-colors';

function BookingRow({ booking, faded }: { booking: Booking; faded?: boolean }) {
  const [downloading, setDownloading] = useState(false);

  const handleTicket = async () => {
    setDownloading(true);
    await generateTicketPDF(booking);
    setDownloading(false);
  };

  return (
    <div className={`border border-zonein-border rounded-[10px] p-4 mb-2.5 flex justify-between items-center ${faded ? 'opacity-60' : ''}`}>
      <div>
        <p className="font-display font-semibold text-[15px] text-zonein-ink">{booking.deskName}</p>
        <p className="text-[13px] text-zonein-gray mt-0.5 capitalize">{booking.deskDesc}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-zonein-gray">{formatDayDate(booking.date)}</span>
        <button
          onClick={handleTicket}
          disabled={downloading}
          className="text-xs font-medium text-zonein-green-dark hover:underline disabled:opacity-50"
        >
          {downloading ? '...' : 'Ticket'}
        </button>
      </div>
    </div>
  );
}

function MyBookingsPage() {
  const { bookings, refreshBookings } = useBooking();

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    setOtpBusy(true);
    await api.sendOtp(phone.trim());
    setOtpBusy(false);
    setOtpSent(true);
  };

  const handleVerify = async () => {
    if (!otpCode.trim()) return;
    setOtpBusy(true);
    const result = await api.verifyOtp(phone.trim(), otpCode.trim());
    setOtpBusy(false);
    if (result.verified) {
      setVerified(true);
      await refreshBookings(phone.trim());
    }
  };

  const reset = () => {
    setPhone('');
    setOtpSent(false);
    setOtpCode('');
    setVerified(false);
  };

  const today = getTodayString();
  const upcoming = bookings.filter(b => b.date >= today);
  const past = bookings.filter(b => b.date < today);

  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <title>My Bookings | ZoneIn Hub</title>
      <meta name="robots" content="noindex, nofollow" />
      <FloatingShapes variant="cream" />
      <div className="relative max-w-lg">
      <h1 className="font-display font-bold text-3xl sm:text-[34px] text-zonein-ink mb-8">My bookings</h1>

      {!verified ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <label className="block text-[13px] font-semibold text-zonein-gray mb-2">Phone number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="080..." className={`${inputClass} mb-5`} />

          {!otpSent ? (
            <button
              disabled={!phone.trim() || otpBusy}
              onClick={handleSendOtp}
              className="w-full bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
            >
              {otpBusy ? 'Sending…' : 'Send code'}
            </button>
          ) : (
            <>
              <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                placeholder="0000" maxLength={4}
                className={`${inputClass} mb-5 text-center tracking-[0.3em]`} />
              <button
                disabled={!otpCode.trim() || otpBusy}
                onClick={handleVerify}
                className="w-full bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
              >
                {otpBusy ? 'Verifying…' : 'Verify'}
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={reset} className="text-[13px] text-zonein-green-dark mb-6">← Use a different number</button>

          <h2 className="font-display font-semibold text-[17px] text-zonein-ink mb-3">Upcoming</h2>
          {upcoming.length > 0 ? (
            upcoming.map(b => <BookingRow key={b.id} booking={b} />)
          ) : (
            <p className="text-sm text-zonein-gray mb-2">No upcoming bookings.</p>
          )}

          <h2 className="font-display font-semibold text-[17px] text-zonein-ink mt-7 mb-3">Past</h2>
          {past.length > 0 ? (
            past.map(b => <BookingRow key={b.id} booking={b} faded />)
          ) : (
            <p className="text-sm text-zonein-gray">No past bookings.</p>
          )}
        </motion.div>
      )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
