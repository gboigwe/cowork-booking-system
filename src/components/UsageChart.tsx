import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/helpers';
import type { AnalyticsData } from '../types';
import { api } from '../utils/api';

/* ─── Animated Number ─── */
function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || value === 0) return;
    const duration = 1500;
    const start = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return <span ref={ref}>{prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}{suffix}</span>;
}

/* ─── Circular Gauge ─── */
function OccupancyGauge({ booked, total }: { booked: number; total: number }) {
  const pct = total > 0 ? (booked / total) * 100 : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * pct) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
          <motion.circle
            cx="100" cy="100" r={radius} fill="none"
            stroke="url(#gaugeGrad)" strokeWidth="16" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white"><AnimatedNumber value={pct} suffix="%" /></span>
          <span className="text-sm text-blue-200/50 font-medium">Occupied</span>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-blue-100/60">Booked ({booked})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-sm text-blue-100/60">Available ({total - booked})</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 p-5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 transition-all duration-500 overflow-hidden relative"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`} />
      <div className="relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-white/10 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <p className="text-sm font-medium text-blue-200/50">{label}</p>
        <div className="text-2xl font-extrabold text-white mt-1">{value}</div>
      </div>
    </motion.div>
  );
}

/* ─── Animated Bar ─── */
function AnimatedBar({ label, value, maxValue, color, delay }: { label: string; value: number; maxValue: number; color: string; delay: number }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-blue-100/60 capitalize w-24 truncate">{label}</span>
      <div className="flex-1 h-8 bg-white/5 rounded-xl overflow-hidden relative border border-white/5">
        <motion.div
          className={`h-full rounded-xl ${color} flex items-center justify-end pr-3`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, 8)}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-bold text-white">{value}</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════ */
/*              USAGE CHART                */
/* ═══════════════════════════════════════ */

function UsageChart() {
  const { desks } = useBooking();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const booked = desks.filter(d => !d.isAvailable).length;
  const total = desks.length;

  const tierColors: Record<string, string> = {
    basic: 'bg-gradient-to-r from-blue-400 to-blue-500',
    premium: 'bg-gradient-to-r from-purple-400 to-purple-500',
    executive: 'bg-gradient-to-r from-amber-400 to-amber-500',
    team: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
            label="Total Bookings"
            value={<AnimatedNumber value={analytics.totalBookings} />}
            color="bg-blue-500"
            delay={0}
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Total Revenue"
            value={formatCurrency(analytics.totalRevenue)}
            color="bg-emerald-500"
            delay={0.1}
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Avg Duration"
            value={<><AnimatedNumber value={analytics.averageHours} decimals={1} />h</>}
            color="bg-purple-500"
            delay={0.2}
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
            label="Most Popular"
            value={analytics.popularDesk || 'N/A'}
            color="bg-amber-500"
            delay={0.3}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Current Occupancy</h3>
              <p className="text-xs text-blue-200/40">Real-time desk availability</p>
            </div>
          </div>
          <OccupancyGauge booked={booked} total={total} />
        </motion.div>

        {/* Desk status grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Desk Status</h3>
              <p className="text-xs text-blue-200/40">All {total} desks at a glance</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {desks.map((desk, i) => (
              <motion.div
                key={desk.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                  desk.isAvailable
                    ? 'bg-green-500/10 border-green-400/30 text-green-300'
                    : 'bg-white/5 border-white/10 text-white/30'
                }`}
              >
                <span className="text-lg font-bold">{desk.position_index}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {desk.isAvailable ? 'Free' : 'Busy'}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tier breakdown */}
      {analytics && analytics.tierBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/15 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Bookings by Tier</h3>
              <p className="text-xs text-blue-200/40">Membership tier distribution</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.tierBreakdown).map(([tier, count], i) => {
              const maxCount = Math.max(...Object.values(analytics.tierBreakdown));
              return (
                <AnimatedBar
                  key={tier}
                  label={tier}
                  value={count}
                  maxValue={maxCount}
                  color={tierColors[tier] || 'bg-gradient-to-r from-gray-400 to-gray-500'}
                  delay={0.5 + i * 0.1}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default UsageChart;
