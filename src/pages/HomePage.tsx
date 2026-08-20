import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';
import ImageSlot from '../components/zonein/ImageSlot';
import { FloatingShape, FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import { CONTACT } from '../utils/contact';
import { DAY_RATE_NGN } from '../context/BookingContext';
import { formatNaira } from '../utils/helpers';

/* ═══════════════════════════════════════════════ */
/*             REUSABLE COMPONENTS                 */
/* ═══════════════════════════════════════════════ */

/* ─── Isometric Desk SVG (ZONEIN green palette) ─── */
function IsometricDesk() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" style={{ filter: 'drop-shadow(0 20px 40px rgba(20,107,69,0.25))' }}>
      <defs>
        <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E9E5B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#146B45" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8FD9AE" />
          <stop offset="100%" stopColor="#2E9E5B" />
        </linearGradient>
        <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7F5F0" />
          <stop offset="100%" stopColor="#D9EFE1" />
        </linearGradient>
      </defs>

      {/* Desk Surface */}
      <motion.path d="M 100 180 L 300 180 L 320 200 L 80 200 Z" fill="url(#deskGrad)" stroke="#146B45" strokeWidth="2"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} />
      {/* Desk Front */}
      <motion.path d="M 80 200 L 320 200 L 320 240 L 80 240 Z" fill="#146B45" opacity="0.7"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 0.8, delay: 0.3 }} />
      {/* Desk Legs */}
      <motion.path d="M 90 240 L 85 280 L 95 280 L 90 240" fill="#146B45" opacity="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.35 }} />
      <motion.path d="M 310 240 L 305 280 L 315 280 L 310 240" fill="#146B45" opacity="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.35 }} />
      {/* Laptop Base */}
      <motion.path d="M 140 160 L 260 160 L 270 180 L 130 180 Z" fill="url(#laptopGrad)" stroke="#2E9E5B" strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.5 }} />
      {/* Laptop Screen */}
      <motion.path d="M 145 100 L 255 100 L 260 160 L 140 160 Z" fill="url(#screenGrad)" stroke="#146B45" strokeWidth="2"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} />
      {/* Screen Content Lines */}
      <motion.rect x="155" y="112" width="90" height="6" rx="2" fill="#F7F5F0" opacity="0.6"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.9 }} />
      <motion.rect x="155" y="124" width="65" height="6" rx="2" fill="#F7F5F0" opacity="0.4"
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1 }} />
      <motion.rect x="155" y="136" width="75" height="6" rx="2" fill="#F7F5F0" opacity="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.1 }} />
      {/* Coffee Cup */}
      <motion.ellipse cx="290" cy="175" rx="12" ry="8" fill="#8FD9AE" opacity="0.9"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.9, scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
      <motion.path d="M 278 175 L 278 165 L 302 165 L 302 175" fill="#D9EFE1" stroke="#2E9E5B" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
      {/* Steam */}
      <motion.path d="M 286 160 Q 283 150 286 142" stroke="#8FD9AE" strokeWidth="1.5" fill="none" opacity="0.5"
        animate={{ y: [0, -3, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M 294 160 Q 297 152 294 144" stroke="#8FD9AE" strokeWidth="1.5" fill="none" opacity="0.5"
        animate={{ y: [0, -4, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
      {/* Plant */}
      <motion.ellipse cx="110" cy="175" rx="10" ry="8" fill="#146B45" opacity="0.7"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ delay: 1.1, type: 'spring' }} />
      <motion.path d="M 110 175 Q 105 165 100 155 M 110 175 Q 110 165 110 150 M 110 175 Q 115 165 120 155"
        stroke="#2E9E5B" strokeWidth="2" fill="none"
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

/* ═══════════════════════════════════════════════ */
/*                   HOME PAGE                     */
/* ═══════════════════════════════════════════════ */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
  };

  return (
    <div ref={containerRef} className="overflow-x-hidden">

      {/* ━━━ HERO ━━━ */}
      <section ref={heroRef} className="relative w-full overflow-hidden bg-zonein-cream">
        {/* Ambient floating shapes */}
        <FloatingShape
          duration={26} delay={0} drift={{ x: 14, y: -18, rotate: 8 }}
          className="top-[10%] right-[8%] w-16 h-16 rounded-full bg-zonein-green opacity-[0.14]"
          shapeStyle={{}}
        />
        <FloatingShape
          duration={32} delay={0.5} drift={{ x: -16, y: 14, rotate: -6 }}
          className="top-[40%] right-[24%] w-11 h-11 bg-zonein-green-dark opacity-[0.12]"
          shapeStyle={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
        />
        <FloatingShape
          duration={24} delay={1} drift={{ x: 10, y: 12, rotate: 0 }}
          className="top-[16%] right-[38%] w-0 h-0 opacity-[0.16]"
          shapeStyle={{ borderLeft: '24px solid transparent', borderRight: '24px solid transparent', borderBottom: '40px solid #8FD9AE' }}
        />
        <FloatingShape
          duration={30} delay={1.5} drift={{ x: -10, y: -14, rotate: 5 }} baseRotate={45}
          className="bottom-[12%] right-[4%] w-9 h-9 bg-zonein-green opacity-10"
          shapeStyle={{}}
        />

        {/* Content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text */}
            <div>
              <motion.h1 custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-zonein-ink"
              >
                A quiet place to get work done.
              </motion.h1>

              <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="mt-5 text-lg leading-relaxed text-zonein-ink max-w-md"
              >
                Stable power, reliable internet, and a calm, focused room to work in. Bring your laptop and settle in.
              </motion.p>

              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="mt-8 flex items-center gap-6 flex-wrap"
              >
                <Link to="/booking"
                  className="inline-flex items-center justify-center px-7 py-4 bg-zonein-green hover:bg-zonein-green-dark text-zonein-cream font-display font-semibold rounded-lg transition-colors duration-150"
                >
                  Book a seat
                </Link>
                <Link to="/space"
                  className="text-sm font-medium text-zonein-green-dark border-b border-transparent hover:border-zonein-green-dark transition-colors duration-150"
                >
                  See the space →
                </Link>
              </motion.div>
            </div>

            {/* Right: 3D Isometric Desk with Parallax */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              className="relative hidden lg:block"
            >
              <TiltCard className="relative">
                {/*
                  Photo placeholder box, kept here (commented) so the height/width
                  clamp(280px,38vw,420px) is on hand once we swap in a real desk photo.
                  <div className="rounded-2xl border border-zonein-border bg-white/50 p-8 h-[clamp(280px,38vw,420px)]" />
                */}
                <div
                  className="relative z-10"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <IsometricDesk />
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ━━━ FEATURE ICONS ━━━ */}
      <section className="relative overflow-hidden py-16 sm:py-18 border-t border-zonein-border">
        <FloatingShapes variant="cream" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { title: 'Stable power', desc: "Backed up, so a blackout outside doesn't mean a lost afternoon inside.", icon: (
                <path d="M13 2 4 14h6l-1 8 9-12h-6z" strokeLinejoin="round" />
              )},
              { title: 'Reliable internet', desc: 'Fast, consistent, and always on, built for downloads, uploads, and deploys alike.', icon: (
                <path d="M5 12.5a10 10 0 0 1 14 0M8 15.8a6 6 0 0 1 8 0M11.5 19a2 2 0 0 1 1 0" strokeLinecap="round" />
              )},
              { title: 'A calm, focused room', desc: 'Ten seats, no crowd, no noise you did not choose to be around.', icon: (
                <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 9h16" strokeLinecap="round" /></>
              )},
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E9E5B" strokeWidth="1.6">{f.icon}</svg>
                <h3 className="font-display font-semibold text-[19px] text-zonein-ink mt-4 mb-2">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-zonein-gray">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ THE SPACE PREVIEW ━━━ */}
      <section className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="flex justify-between items-baseline flex-wrap gap-3 mb-8">
              <h2 className="font-display font-semibold text-2xl sm:text-[30px] text-zonein-ink">The space</h2>
              <Link to="/space" className="text-sm font-medium text-zonein-green-dark">Take a full look →</Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FadeIn delay={0}><ImageSlot label="Interior photo" className="h-[220px]" /></FadeIn>
            <FadeIn delay={0.1}><ImageSlot label="Seating photo" className="h-[220px]" /></FadeIn>
            <FadeIn delay={0.2}><ImageSlot label="Interior photo" className="h-[220px]" /></FadeIn>
          </div>
        </div>
      </section>

      {/* ━━━ DAY PASS BANNER ━━━ */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-zonein-green-dark">
        <FloatingShapes variant="green" />
        <FadeIn className="relative max-w-7xl mx-auto px-5 sm:px-8 flex justify-between items-center flex-wrap gap-6">
          <div>
            <p className="text-zonein-green-light text-sm font-semibold tracking-[0.04em] uppercase mb-2">Day pass</p>
            <h2 className="font-display font-bold text-zonein-cream text-3xl sm:text-4xl">
              {formatNaira(DAY_RATE_NGN)} <span className="text-lg font-medium text-zonein-green-light">/ day</span>
            </h2>
          </div>
          <Link to="/pricing"
            className="bg-zonein-cream text-zonein-green-dark font-display font-semibold rounded-lg px-7 py-4 hover:opacity-90 transition-opacity"
          >
            See pricing details
          </Link>
        </FadeIn>
      </section>

      {/* ━━━ GOOD TO KNOW ━━━ */}
      <section className="relative overflow-hidden py-14 sm:py-18">
        <FloatingShapes variant="cream" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn><h2 className="font-display font-semibold text-2xl sm:text-[30px] text-zonein-ink mb-7">Good to know</h2></FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FadeIn delay={0}>
              <div className="border border-zonein-border rounded-xl p-6">
                <p className="font-display font-semibold text-base text-zonein-ink mb-2">Where</p>
                <p className="text-[15px] leading-relaxed text-zonein-gray">{CONTACT.addressLine1}, {CONTACT.addressShort}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="border border-zonein-border rounded-xl p-6">
                <p className="font-display font-semibold text-base text-zonein-ink mb-2">Hours</p>
                <p className="text-[15px] leading-relaxed text-zonein-gray">{CONTACT.hours}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="border border-zonein-border rounded-xl p-6">
                <p className="font-display font-semibold text-base text-zonein-ink mb-2">Walk-ins</p>
                <p className="text-[15px] leading-relaxed text-zonein-gray">Welcome any time a desk is free, no booking required.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="relative overflow-hidden py-16 sm:py-24 text-center">
        <FloatingShapes variant="cream" />
        <FadeIn className="relative max-w-2xl mx-auto px-4">
          <h2 className="font-display font-semibold text-[26px] sm:text-[34px] text-zonein-ink mb-6">Ready to get some work done?</h2>
          <Link to="/booking"
            className="inline-flex items-center justify-center bg-zonein-green hover:bg-zonein-green-dark text-zonein-cream font-display font-semibold rounded-lg px-8 py-4 transition-colors duration-150"
          >
            Book a seat
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
