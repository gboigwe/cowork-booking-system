import { motion } from 'framer-motion';

/* ─── Single ambient floating shape (circle / hexagon / triangle / crystal-facet echo) ─── */
export function FloatingShape({
  shapeStyle, className = '', duration = 26, delay = 0, baseRotate = 0, drift = { x: 14, y: -18, rotate: 8 },
}: {
  shapeStyle: React.CSSProperties;
  className?: string;
  duration?: number;
  delay?: number;
  baseRotate?: number;
  drift?: { x: number; y: number; rotate: number };
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={shapeStyle}
      animate={{ x: [0, drift.x, 0], y: [0, drift.y, 0], rotate: [baseRotate, baseRotate + drift.rotate, baseRotate] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── Preset field of 4 shapes for a section. Drop into any `relative overflow-hidden`
     section. `cream` = dark-green shapes for light backgrounds, `green` = light/cream
     shapes for the dark-green sections, per brand guide: sparse, low opacity, never busy. ─── */
export function FloatingShapes({ variant = 'cream' }: { variant?: 'cream' | 'green' }) {
  const solid = variant === 'cream' ? '#2E9E5B' : '#F7F5F0';
  const solidDark = variant === 'cream' ? '#146B45' : '#8FD9AE';
  const triangleColor = variant === 'cream' ? '#8FD9AE' : '#F7F5F0';
  const opacityClass = variant === 'cream' ? 'opacity-[0.13]' : 'opacity-[0.16]';
  const opacityClassSoft = variant === 'cream' ? 'opacity-10' : 'opacity-[0.14]';

  return (
    <>
      <FloatingShape
        duration={27} delay={0} drift={{ x: 12, y: -16, rotate: 6 }}
        className={`top-[8%] right-[10%] w-14 h-14 rounded-full ${opacityClass}`}
        shapeStyle={{ backgroundColor: solid }}
      />
      <FloatingShape
        duration={33} delay={0.6} drift={{ x: -14, y: 12, rotate: -5 }}
        className={`top-[55%] left-[6%] w-10 h-10 ${opacityClassSoft}`}
        shapeStyle={{ backgroundColor: solidDark, clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
      />
      <FloatingShape
        duration={23} delay={1.1} drift={{ x: 8, y: 10, rotate: 0 }}
        className={`top-[20%] left-[14%] w-0 h-0 ${opacityClass}`}
        shapeStyle={{ borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: `30px solid ${triangleColor}` }}
      />
      <FloatingShape
        duration={29} delay={1.6} drift={{ x: -9, y: -12, rotate: 5 }} baseRotate={45}
        className={`bottom-[10%] right-[8%] w-8 h-8 ${opacityClassSoft}`}
        shapeStyle={{ backgroundColor: solid }}
      />
    </>
  );
}
