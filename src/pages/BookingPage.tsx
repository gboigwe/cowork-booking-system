import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeskLayout from '../components/zonein/DeskLayout';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import { useBooking, DAY_RATE_NGN } from '../context/BookingContext';
import { api } from '../utils/api';
import { formatNaira, getTodayString } from '../utils/helpers';
import { generateTicketPDF } from '../utils/ticket';
import type { Booking, PayMethod } from '../types';

type Step = 'select' | 'identity' | 'payment' | 'confirm';

const inputClass = 'w-full px-4 py-3.5 border border-zonein-border rounded-lg text-[15px] font-sans outline-none focus:border-zonein-green transition-colors';

function BookingPage() {
  const { desks, selectedDesk, selectDesk, clearSelectedDesk, createBooking } = useBooking();

  const [step, setStep] = useState<Step>('select');
  const [date, setDate] = useState(getTodayString());
  const [holderName, setHolderName] = useState('');
  const [holderPhone, setHolderPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [downloadingTicket, setDownloadingTicket] = useState(false);

  const canProceedToIdentity = !!(selectedDesk && date);

  const handleSendOtp = async () => {
    if (!holderName.trim() || !holderPhone.trim()) return;
    setOtpBusy(true);
    await api.sendOtp(holderPhone.trim());
    setOtpBusy(false);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) return;
    setOtpBusy(true);
    const result = await api.verifyOtp(holderPhone.trim(), otpCode.trim());
    setOtpBusy(false);
    if (result.verified) setStep('payment');
  };

  const handleConfirmBooking = async () => {
    if (!payMethod) return;
    const booking = await createBooking({
      date, holderName: holderName.trim(), holderPhone: holderPhone.trim(), payMethod,
    });
    if (booking) {
      setLastBooking(booking);
      setStep('confirm');
    }
  };

  const handleDownloadTicket = async () => {
    if (!lastBooking) return;
    setDownloadingTicket(true);
    await generateTicketPDF(lastBooking);
    setDownloadingTicket(false);
  };

  const resetFlow = () => {
    clearSelectedDesk();
    setStep('select');
    setDate(getTodayString());
    setHolderName('');
    setHolderPhone('');
    setOtpSent(false);
    setOtpCode('');
    setPayMethod(null);
    setLastBooking(null);
  };

  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <FloatingShapes variant="cream" />
      <h1 className="relative font-display font-bold text-3xl sm:text-4xl text-zonein-ink mb-2">Book a seat</h1>
      <p className="relative text-[15px] text-zonein-gray mb-10">Pick a desk, choose a date, and you're set.</p>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start"
          >
            <DeskLayout
              desks={desks}
              interactive
              selectedId={selectedDesk?.id ?? null}
              onSelectDesk={selectDesk}
            />

            <div className="border border-zonein-border rounded-2xl p-7 lg:sticky lg:top-28">
              {selectedDesk ? (
                <>
                  <p className="font-display font-bold text-xl text-zonein-ink mb-1">{selectedDesk.id}</p>
                  <p className="text-sm text-zonein-gray mb-6 capitalize">{selectedDesk.desc}</p>
                  <label className="block text-[13px] font-semibold text-zonein-gray mb-2">Date</label>
                  <input
                    type="date" value={date} min={getTodayString()}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputClass} mb-5`}
                  />
                  <div className="flex justify-between py-3.5 border-t border-zonein-border mb-5">
                    <span className="text-sm text-zonein-gray">Rate</span>
                    <span className="text-sm font-semibold text-zonein-ink">{formatNaira(DAY_RATE_NGN)} / day</span>
                  </div>
                  <button
                    disabled={!canProceedToIdentity}
                    onClick={() => setStep('identity')}
                    className="w-full bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light disabled:cursor-not-allowed text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
                  >
                    Confirm booking
                  </button>
                </>
              ) : (
                <p className="text-sm text-zonein-gray text-center py-10">Select a desk to continue</p>
              )}
            </div>
          </motion.div>
        )}

        {step === 'identity' && (
          <motion.div key="identity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative max-w-md">
            <button onClick={() => setStep('select')} className="text-sm text-zonein-green-dark mb-5">← Back</button>
            <h2 className="font-display font-semibold text-xl text-zonein-ink mb-2">Who's booking?</h2>
            <p className="text-sm text-zonein-gray mb-7">No account needed. We'll verify with a one-time code.</p>

            <label className="block text-[13px] font-semibold text-zonein-gray mb-2">Name</label>
            <input type="text" value={holderName} onChange={(e) => setHolderName(e.target.value)}
              placeholder="Your name" className={`${inputClass} mb-5`} />

            <label className="block text-[13px] font-semibold text-zonein-gray mb-2">Phone number</label>
            <input type="tel" value={holderPhone} onChange={(e) => setHolderPhone(e.target.value)}
              placeholder="080..." className={`${inputClass} mb-6`} />

            {!otpSent ? (
              <button
                disabled={!holderName.trim() || !holderPhone.trim() || otpBusy}
                onClick={handleSendOtp}
                className="w-full bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
              >
                {otpBusy ? 'Sending…' : 'Send code'}
              </button>
            ) : (
              <>
                <p className="text-[13px] text-zonein-gray mb-4">Code sent. Enter any 4 digits to continue.</p>
                <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="0000" maxLength={4}
                  className={`${inputClass} mb-5 text-center tracking-[0.3em]`} />
                <button
                  disabled={!otpCode.trim() || otpBusy}
                  onClick={handleVerifyOtp}
                  className="w-full bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
                >
                  {otpBusy ? 'Verifying…' : 'Verify & continue'}
                </button>
              </>
            )}
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative max-w-md">
            <button onClick={() => setStep('identity')} className="text-sm text-zonein-green-dark mb-5">← Back</button>
            <h2 className="font-display font-semibold text-xl text-zonein-ink mb-6">How would you like to pay?</h2>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setPayMethod('online')}
                className={`text-left border-[1.5px] rounded-[10px] p-[18px] transition-colors ${payMethod === 'online' ? 'border-zonein-green' : 'border-zonein-border'}`}
              >
                <p className="font-display font-semibold text-[15px] text-zonein-ink mb-1">Pay online</p>
                <p className="text-[13px] text-zonein-gray">Card or bank transfer, {formatNaira(DAY_RATE_NGN)}</p>
              </button>
              <button
                onClick={() => setPayMethod('venue')}
                className={`text-left border-[1.5px] rounded-[10px] p-[18px] transition-colors ${payMethod === 'venue' ? 'border-zonein-green' : 'border-zonein-border'}`}
              >
                <p className="font-display font-semibold text-[15px] text-zonein-ink mb-1">Pay at the venue</p>
                <p className="text-[13px] text-zonein-gray">Settle up when you arrive</p>
              </button>
            </div>

            <button
              disabled={!payMethod}
              onClick={handleConfirmBooking}
              className="w-full bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
            >
              Confirm booking
            </button>
          </motion.div>
        )}

        {step === 'confirm' && lastBooking && (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md border border-zonein-border rounded-2xl p-9 bg-zonein-cream"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-zonein-green-dark mb-4">Booking confirmed</p>
            <p className="text-sm text-zonein-gray mb-1">Desk</p>
            <p className="font-display font-bold text-xl text-zonein-ink mb-4">{lastBooking.deskName} · {lastBooking.deskDesc}</p>
            <p className="text-sm text-zonein-gray mb-1">Date</p>
            <p className="font-display font-semibold text-base text-zonein-ink mb-4">{lastBooking.date}</p>
            <p className="text-sm text-zonein-gray mb-1">Payment</p>
            <p className="font-display font-semibold text-base text-zonein-ink mb-6">
              {lastBooking.payMethod === 'online' ? 'Paid online' : 'Pay at the venue'}
            </p>

            <button
              onClick={handleDownloadTicket}
              disabled={downloadingTicket}
              className="w-full border border-zonein-green text-zonein-green-dark font-display font-semibold rounded-lg py-3.5 mb-3 hover:bg-zonein-green/5 transition-colors"
            >
              {downloadingTicket ? 'Generating…' : 'Download ticket'}
            </button>
            <button
              onClick={resetFlow}
              className="w-full bg-zonein-green hover:bg-zonein-green-dark text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookingPage;
