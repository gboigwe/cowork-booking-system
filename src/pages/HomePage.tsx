import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════ */
/*             REUSABLE 3D COMPONENTS              */
/* ═══════════════════════════════════════════════ */

/* ─── Animated Counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Floating Shape ─── */
function FloatingShape({ delay = 0, duration = 20, className = '' }: { delay?: number; duration?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 180, 360] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── Gradient Mesh Background ─── */
function GradientMesh({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900" />
      <div
        className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl"
        style={{ transform: `translate(${mouseX * 50}px, ${mouseY * 50}px)`, transition: 'transform 0.3s ease-out' }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"
        style={{ transform: `translate(${-mouseX * 30}px, ${mouseY * 30}px)`, transition: 'transform 0.3s ease-out' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl"
        style={{ transform: `translate(${mouseX * 20}px, ${-mouseY * 20}px)`, transition: 'transform 0.3s ease-out' }}
      />
    </div>
  );
}

/* ─── Isometric Desk SVG ─── */
function IsometricDesk() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" style={{ filter: 'drop-shadow(0 20px 40px rgba(59,130,246,0.3))' }}>
      <defs>
        <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>

      {/* Desk Surface */}
      <motion.path d="M 100 180 L 300 180 L 320 200 L 80 200 Z" fill="url(#deskGrad)" stroke="#1e40af" strokeWidth="2"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} />
      {/* Desk Front */}
      <motion.path d="M 80 200 L 320 200 L 320 240 L 80 240 Z" fill="#1e40af" opacity="0.7"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 0.8, delay: 0.3 }} />
      {/* Desk Legs */}
      <motion.path d="M 90 240 L 85 280 L 95 280 L 90 240" fill="#1e40af" opacity="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.35 }} />
      <motion.path d="M 310 240 L 305 280 L 315 280 L 310 240" fill="#1e40af" opacity="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.35 }} />
      {/* Laptop Base */}
      <motion.path d="M 140 160 L 260 160 L 270 180 L 130 180 Z" fill="url(#laptopGrad)" stroke="#2563eb" strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.5 }} />
      {/* Laptop Screen */}
      <motion.path d="M 145 100 L 255 100 L 260 160 L 140 160 Z" fill="url(#screenGrad)" stroke="#1e40af" strokeWidth="2"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} />
      {/* Screen Content Lines */}
      <motion.rect x="155" y="112" width="90" height="6" rx="2" fill="#dbeafe" opacity="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.9 }} />
      <motion.rect x="155" y="124" width="65" height="6" rx="2" fill="#dbeafe" opacity="0.3"
        initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1 }} />
      <motion.rect x="155" y="136" width="75" height="6" rx="2" fill="#dbeafe" opacity="0.4"
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.1 }} />
      {/* Coffee Cup */}
      <motion.ellipse cx="290" cy="175" rx="12" ry="8" fill="#60a5fa" opacity="0.8"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
      <motion.path d="M 278 175 L 278 165 L 302 165 L 302 175" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
      {/* Steam */}
      <motion.path d="M 286 160 Q 283 150 286 142" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.5"
        animate={{ y: [0, -3, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M 294 160 Q 297 152 294 144" stroke="#93c5fd" strokeWidth="1.5" fill="none" opacity="0.5"
        animate={{ y: [0, -4, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
      {/* Plant */}
      <motion.ellipse cx="110" cy="175" rx="10" ry="8" fill="#3b82f6" opacity="0.6"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1 }} transition={{ delay: 1.1, type: 'spring' }} />
      <motion.path d="M 110 175 Q 105 165 100 155 M 110 175 Q 110 165 110 150 M 110 175 Q 115 165 120 155"
        stroke="#60a5fa" strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.2 }} />
    </svg>
  );
}

/* ─── 3D Tilt Card (spring-based) ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Glassmorphism Card ─── */
function GlassCard({ icon, title, desc, index }: { icon: React.ReactNode; title: string; desc: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <TiltCard>
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300">
              {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-blue-100/70 text-sm leading-relaxed">{desc}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Scroll Reveal ─── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════ */
/*                   HOME PAGE                     */
/* ═══════════════════════════════════════════════ */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const parallaxX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const parallaxY = useTransform(smoothY, [-1, 1], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: nx, y: ny });
      mouseX.set(nx * 2 - 1);
      mouseY.set(ny * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  return (
    <div ref={containerRef} className="overflow-x-hidden">

      {/* ━━━ HERO ━━━ */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden pt-16">
        <GradientMesh mouseX={mousePos.x} mouseY={mousePos.y} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Floating shapes */}
        <FloatingShape delay={0} duration={25} className="w-64 h-64 bg-blue-500/10 blur-3xl top-20 left-10" />
        <FloatingShape delay={2} duration={30} className="w-96 h-96 bg-blue-400/10 blur-3xl top-1/4 right-10" />
        <FloatingShape delay={4} duration={20} className="w-80 h-80 bg-white/5 blur-3xl bottom-40 left-1/4" />
        <FloatingShape delay={1} duration={18} className="top-[15%] right-[15%] w-16 h-16 border-2 border-white/10 backdrop-blur-sm" />
        <FloatingShape delay={3} duration={14} className="top-[55%] left-[8%] w-10 h-10 border border-white/10 backdrop-blur-sm" />

        {/* Content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 sm:px-6 py-12 lg:py-20 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text */}
            <div className="space-y-8">
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-sm text-blue-100 font-medium">10 Desks Available Today</span>
              </motion.div>

              <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                  Where Innovation
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400">
                  Meets Workspace
                </span>
              </motion.h1>

              <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="text-lg sm:text-xl text-blue-100/70 max-w-xl leading-relaxed"
              >
                Premium co-working desks in a space designed for the future. Book instantly, work flexibly, and connect with a thriving tech community.
              </motion.p>

              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/booking"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/40"
                >
                  Book Your Desk
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  Explore Features
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                className="grid grid-cols-4 gap-4 pt-6"
              >
                {[
                  { value: 500, suffix: '+', label: 'Bookings Made' },
                  { value: 98, suffix: '%', label: 'Satisfaction' },
                  { value: 10, suffix: '', label: 'Premium Desks' },
                  { value: 24, suffix: '/7', label: 'Access' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-blue-200/60 text-xs sm:text-sm">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D Isometric Desk with Parallax */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              className="relative hidden lg:block"
            >
              <TiltCard className="relative">
                <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
                  <IsometricDesk />
                </div>
              </TiltCard>

              {/* Floating glass cards around the desk */}
              <motion.div
                className="absolute -top-8 -right-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">Desk Booked!</p>
                    <p className="text-blue-200/60 text-[10px]">Just now</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">42 Members Active</p>
                    <p className="text-blue-200/60 text-[10px]">Right now</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom fade to features */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950 to-transparent pointer-events-none" />
      </section>

      {/* ━━━ FEATURES - GLASSMORPHISM CARDS ━━━ */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 overflow-hidden">
        <FloatingShape delay={0} duration={20} className="w-80 h-80 bg-blue-500/10 blur-3xl top-10 right-20" />
        <FloatingShape delay={3} duration={25} className="w-64 h-64 bg-white/5 blur-3xl bottom-20 left-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-200 text-sm font-medium mb-4">
                Why TECH-AGE Hub
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Built for the Modern Worker</h2>
              <p className="mt-4 text-blue-100/60 text-lg max-w-2xl mx-auto">Every detail designed to help you do your best work</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Flexible Spaces', desc: 'Individual focus desks and collaborative team tables. Choose what fits your workflow — switch anytime.', icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              )},
              { title: 'Gigabit WiFi', desc: 'Enterprise-grade mesh network. Seamless video calls, instant uploads, zero lag.', icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
              )},
              { title: 'Community Events', desc: 'Weekly mixers, tech talks, and hackathons. Your next co-founder might be one desk away.', icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              )},
              { title: '24/7 Access', desc: 'Keycard entry around the clock. Night owls and early birds equally welcome.', icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )},
              { title: 'Meeting Rooms', desc: 'Soundproof rooms with 4K displays, whiteboards, and video conferencing built in.', icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )},
              { title: 'Premium Security', desc: 'Enterprise-grade security with personal lockers, CCTV monitoring, and secure access.', icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              )},
            ].map((f, i) => (
              <GlassCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-24 bg-gradient-to-b from-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-200 text-sm font-medium mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Book in 60 Seconds</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-blue-500/30 via-blue-400/50 to-blue-500/30" />

            {[
              { step: '01', title: 'Pick Your Desk', desc: 'Explore our interactive C-shaped floor plan. Tap any green desk to select it.', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              )},
              { step: '02', title: 'Choose Your Slot', desc: 'Pick a date and time range. See real-time availability. Select your membership tier.', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              )},
              { step: '03', title: "You're In", desc: 'Confirm your booking and start working. Cancel anytime from your dashboard.', icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              )},
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.15}>
                <div className="relative text-center">
                  <motion.div
                    className="w-14 h-14 bg-blue-500/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-blue-300 mx-auto mb-5 shadow-lg shadow-blue-500/20"
                    whileHover={{ scale: 1.1, rotate: 5, backgroundColor: 'rgba(59,130,246,0.4)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {s.icon}
                  </motion.div>
                  <span className="text-xs font-bold text-blue-400/60 tracking-widest">{s.step}</span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-2">{s.title}</h3>
                  <p className="text-blue-100/60 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-950 relative overflow-hidden">
        <FloatingShape delay={1} duration={22} className="w-72 h-72 bg-blue-500/10 blur-3xl top-20 left-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-200 text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Loved by Professionals</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'UX Designer, Freelance', text: 'TECH-AGE Hub transformed my workflow. The atmosphere is electric, and the community here is incredible. Best co-working space I\'ve ever used.' },
              { name: 'Marcus Johnson', role: 'CTO, StartupXYZ', text: 'We moved our entire 5-person team here. The meeting rooms are world-class, the WiFi never drops, and the pricing is transparent.' },
              { name: 'Amara Okafor', role: 'Full-Stack Developer', text: 'The interactive booking system is genius. I can see exactly which desks are free, book in seconds, and the C-shaped layout means I always find my favorite spot.' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <TiltCard>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/15 rounded-2xl p-7 h-full hover:bg-white/10 transition-all duration-500 group">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-blue-100/70 leading-relaxed mb-5 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold border-2 border-white/20">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-blue-200/60">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PRICING ━━━ */}
      <section className="py-24 bg-gradient-to-b from-blue-950 to-slate-900 relative overflow-hidden">
        <FloatingShape delay={2} duration={18} className="w-72 h-72 bg-blue-400/10 blur-3xl bottom-20 right-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-200 text-sm font-medium mb-4">
                Pricing
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3">Invest in Your Productivity</h2>
              <p className="mt-4 text-blue-100/60 text-lg">Transparent hourly pricing. No subscriptions. No hidden fees.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { tier: 'Basic', price: 10, desc: 'Perfect for focus work', features: ['Individual desk', 'WiFi access', 'Common areas', 'Coffee & tea'] },
              { tier: 'Premium', price: 15, desc: 'For power users', features: ['Individual desk', 'Priority WiFi', 'Meeting rooms (2hr)', 'Refreshments', 'Locker access'], popular: true },
              { tier: 'Executive', price: 20, desc: 'The full experience', features: ['Individual desk', 'Dedicated WiFi', 'Meeting rooms (4hr)', 'Full catering', 'Phone booth', 'Print/scan'] },
            ].map((p, i) => (
              <Reveal key={p.tier} delay={i * 0.1}>
                <TiltCard>
                  <div className={`relative rounded-2xl p-8 h-full ${
                    p.popular
                      ? 'bg-gradient-to-br from-blue-500/30 to-indigo-500/20 backdrop-blur-xl border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20 scale-[1.03]'
                      : 'backdrop-blur-xl bg-white/5 border border-white/15 hover:bg-white/10 transition-all duration-500'
                  }`}>
                    {p.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white">{p.tier}</h3>
                    <p className="text-sm mt-1 text-blue-200/60">{p.desc}</p>
                    <div className="mt-5 mb-6">
                      <span className="text-5xl font-extrabold text-white">${p.price}</span>
                      <span className="text-base text-blue-200/60">/hr</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-blue-100/70">
                          <svg className="w-4 h-4 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/booking"
                      className={`block text-center py-3.5 rounded-full font-semibold transition-all duration-300 ${
                        p.popular
                          ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:scale-105'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-10 backdrop-blur-xl bg-white/5 border border-white/15 rounded-2xl p-6 max-w-lg mx-auto">
              <p className="text-blue-100/80 font-medium">
                Team Desk — <span className="text-white font-bold text-xl">$25/hr</span>
              </p>
              <p className="text-blue-200/50 text-sm mt-1">Seats 4-6 people. Perfect for project sprints.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-900 to-blue-950">
        <FloatingShape delay={0} duration={15} className="w-80 h-80 bg-blue-500/15 blur-3xl top-10 left-1/4" />
        <FloatingShape delay={2} duration={20} className="w-64 h-64 bg-white/5 blur-3xl bottom-10 right-1/4" />

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Your Best Work<br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Starts Here</span>
            </h2>
            <p className="mt-6 text-blue-100/60 text-lg max-w-xl mx-auto">
              Join a growing community of professionals, creators, and innovators who call TECH-AGE Hub home.
            </p>
            <Link to="/booking"
              className="group inline-flex items-center gap-2 mt-10 bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              Reserve Your Desk Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
