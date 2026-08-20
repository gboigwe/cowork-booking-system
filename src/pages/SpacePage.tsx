import { useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import DeskLayout from '../components/zonein/DeskLayout';
import ImageSlot from '../components/zonein/ImageSlot';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';

const amenities = [
  { title: 'Power backup', desc: "Uninterrupted, so an outage outside doesn't reach your desk." },
  { title: 'Internet', desc: 'A dedicated fibre line, fast enough for downloads and uploads together.' },
  { title: 'Seating', desc: '10 desks. No overbooking, no crowding.' },
  { title: 'Layout', desc: 'An open room kept quiet by design, not by rule.' },
];

function SpacePage() {
  const { desks, refreshDesks } = useBooking();

  useEffect(() => { refreshDesks(); }, [refreshDesks]);

  return (
    <div>
      <ImageSlot label="Drop a wide interior photo" className="w-full h-[clamp(240px,34vw,420px)]" rounded={false} />

      <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
        <FloatingShapes variant="cream" />

        <FadeIn className="relative">
          <h1 className="font-display font-bold text-3xl sm:text-[42px] text-zonein-ink mb-3">The space</h1>
          <p className="text-base text-zonein-gray mb-12 max-w-xl">Ten desks, a calm room, and everything you need to sit down and work.</p>
        </FadeIn>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {amenities.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.08}>
              <div className="border border-zonein-border rounded-xl p-6">
                <p className="font-display font-semibold text-[16px] text-zonein-ink mb-2">{a.title}</p>
                <p className="text-sm leading-relaxed text-zonein-gray">{a.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn><h2 className="relative font-display font-semibold text-[22px] text-zonein-ink mb-6">Around the room</h2></FadeIn>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-18">
          {['Photo', 'Photo', 'Photo', 'Photo'].map((label, i) => (
            <FadeIn key={i} delay={i * 0.08}><ImageSlot label={label} className="h-[200px]" /></FadeIn>
          ))}
        </div>

        <FadeIn className="relative">
          <h2 className="font-display font-semibold text-[22px] text-zonein-ink mb-2 mt-16">Floor plan</h2>
          <p className="text-sm text-zonein-gray mb-8">6 desks along the right wall, 4 along the left, entrance at the front.</p>
          <div className="max-w-[520px]">
            <DeskLayout desks={desks} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default SpacePage;
