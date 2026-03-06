import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, calculateHours, getTodayString } from '../utils/helpers';
import type { MembershipTier } from '../types';

interface BookingFormProps {
  onSuccess?: () => void;
}

function BookingForm({ onSuccess }: BookingFormProps) {
  const { selectedDesk, createBooking, calculateTotal, refreshDesks } = useBooking();

  const [formData, setFormData] = useState({
    date: getTodayString(),
    startTime: '09:00',
    endTime: '10:00',
    membershipTier: 'basic' as MembershipTier,
  });

  const [totalCost, setTotalCost] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDesk) {
      const hours = calculateHours(formData.startTime, formData.endTime);
      if (hours > 0) {
        setTotalCost(calculateTotal(hours, selectedDesk.type, formData.membershipTier));
      }
    }
  }, [selectedDesk, formData, calculateTotal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateTimeBlur = () => {
    if (formData.date && formData.startTime && formData.endTime) {
      refreshDesks(formData.date, formData.startTime, formData.endTime);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createBooking(formData);
    setFormData({ date: getTodayString(), startTime: '09:00', endTime: '10:00', membershipTier: 'basic' });
    setSubmitting(false);
    if (result && onSuccess) onSuccess();
  };

  const hours = calculateHours(formData.startTime, formData.endTime);

  const inputClass = 'w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 outline-none transition-all text-white placeholder:text-white/30 hover:bg-white/10';

  return (
    <AnimatePresence mode="wait">
      {!selectedDesk ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm border border-blue-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
          </div>
          <p className="text-white/80 font-medium">Select a desk from the map to begin booking</p>
          <p className="text-blue-200/40 text-sm mt-1">Click any green desk on the floor plan</p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 shadow-2xl overflow-hidden"
        >
          {/* Selected desk header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300/70 text-xs font-medium uppercase tracking-wider">Selected</p>
                <h3 className="text-xl font-bold text-white">{selectedDesk.name}</h3>
              </div>
              <span className="bg-white/10 backdrop-blur-sm text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-lg capitalize border border-white/20">
                {selectedDesk.type}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-blue-100/80 mb-1.5">Date</label>
              <input type="date" id="date" name="date" value={formData.date} min={getTodayString()}
                onChange={handleChange} onBlur={handleDateTimeBlur} className={inputClass} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startTime" className="block text-sm font-semibold text-blue-100/80 mb-1.5">Start</label>
                <input type="time" id="startTime" name="startTime" value={formData.startTime}
                  onChange={handleChange} onBlur={handleDateTimeBlur} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-semibold text-blue-100/80 mb-1.5">End</label>
                <input type="time" id="endTime" name="endTime" value={formData.endTime}
                  onChange={handleChange} onBlur={handleDateTimeBlur} className={inputClass} required />
              </div>
            </div>

            {selectedDesk.type === 'individual' && (
              <div>
                <label htmlFor="membershipTier" className="block text-sm font-semibold text-blue-100/80 mb-1.5">Membership Tier</label>
                <select id="membershipTier" name="membershipTier" value={formData.membershipTier}
                  onChange={handleChange} className={inputClass} required>
                  <option value="basic">Basic ($10/hour)</option>
                  <option value="premium">Premium ($15/hour)</option>
                  <option value="executive">Executive ($20/hour)</option>
                </select>
              </div>
            )}

            {/* Cost summary */}
            <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-2" layout>
              <div className="flex justify-between text-sm text-blue-100/60">
                <span>Desk Type</span>
                <span className="capitalize font-medium text-blue-100/80">{selectedDesk.type}</span>
              </div>
              {selectedDesk.type === 'individual' && (
                <div className="flex justify-between text-sm text-blue-100/60">
                  <span>Tier</span>
                  <span className="capitalize font-medium text-blue-100/80">{formData.membershipTier}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-blue-100/60">
                <span>Duration</span>
                <span className="font-medium text-blue-100/80">{hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : 'Invalid'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-base font-bold text-white">Total</span>
                <motion.span key={totalCost} initial={{ scale: 1.2, color: '#60a5fa' }} animate={{ scale: 1, color: '#93c5fd' }}
                  className="text-xl font-extrabold"
                >
                  {hours > 0 ? formatCurrency(totalCost) : '-'}
                </motion.span>
              </div>
            </motion.div>

            <motion.button type="submit" disabled={hours <= 0 || submitting}
              className="w-full bg-blue-500 text-white py-3.5 rounded-full font-bold text-base hover:bg-blue-600 transition-all disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Booking...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Confirm Booking
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BookingForm;
