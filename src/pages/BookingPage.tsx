import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeskMapSVG from '../components/booking/DeskMapSVG';
import BookingForm from '../components/BookingForm';
import { useBooking } from '../context/BookingContext';

const steps = [
  { num: 1, label: 'Select Desk', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
    </svg>
  )},
  { num: 2, label: 'Choose Time', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { num: 3, label: 'Confirm', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
];

function BookingPage() {
  const { selectedDesk } = useBooking();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const currentStep = bookingSuccess ? 3 : selectedDesk ? 2 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Page header */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-200 text-sm font-medium mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Booking
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Book Your Space</h1>
            <p className="text-blue-100/60 mt-2 text-lg">Select a desk, choose your time, and you're in.</p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            className="mt-8 flex items-center gap-0 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      currentStep >= step.num
                        ? 'bg-blue-500/30 backdrop-blur-xl border border-blue-400/30 text-blue-300 shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 border border-white/10 text-white/30'
                    }`}
                    animate={currentStep >= step.num ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {step.icon}
                  </motion.div>
                  <span className={`text-sm font-semibold hidden sm:block transition-colors duration-300 ${
                    currentStep >= step.num ? 'text-white' : 'text-white/30'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500/50 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: currentStep > step.num ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <AnimatePresence mode="wait">
          {bookingSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                className="w-24 h-24 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-full flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-blue-100/60 mb-8">Your desk has been reserved successfully.</p>
              <div className="flex gap-4">
                <button onClick={() => setBookingSuccess(false)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-105"
                >
                  Book Another
                </button>
                <a href="/my-bookings"
                  className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all"
                >
                  View Bookings
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="booking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2"
            >
              {/* Floor Plan */}
              <motion.div className="lg:col-span-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 shadow-2xl shadow-blue-500/5 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Floor Plan</h3>
                          <p className="text-xs text-blue-200/50">Click an available desk to select it</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-blue-200/50">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-400" /> Available</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-500" /> Booked</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Selected</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <DeskMapSVG />
                  </div>
                </div>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <BookingForm onSuccess={() => setBookingSuccess(true)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BookingPage;
