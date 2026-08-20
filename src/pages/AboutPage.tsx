import { CONTACT } from '../utils/contact';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';

function AboutPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <FloatingShapes variant="cream" />
      <div className="relative max-w-3xl">

      <FadeIn className="relative">
        <h1 className="font-display font-bold text-3xl sm:text-[38px] text-zonein-ink mb-3">About</h1>
        <p className="font-display font-semibold text-xl text-zonein-green-dark mb-8">Where focus takes shape.</p>

        <p className="text-base leading-[1.75] text-zonein-ink mb-6">
          ZoneIn Hub is a coworking day pass space in {CONTACT.addressShort}, built for tech professionals, freelancers, and remote workers. The offer is simple: stable power, reliable internet, and a calm, focused room to work in. Bring your own laptop and everything you need on it.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="relative">
        <h2 className="font-display font-semibold text-xl text-zonein-ink mt-10 mb-3">What it isn't</h2>
        <p className="text-base leading-[1.75] text-zonein-ink mb-6">
          ZoneIn Hub is a workspace, not a cyber café. That is a deliberate choice, not a gap in the offer. There are no shared computers, no printing, no photocopying.
        </p>
      </FadeIn>

      <FadeIn delay={0.2} className="relative">
        <h2 className="font-display font-semibold text-xl text-zonein-ink mt-10 mb-3">Who it's for</h2>
        <p className="text-base leading-[1.75] text-zonein-ink mb-6">
          Tech professionals, freelancers, and remote workers who need a quiet, dependable place to get real work done, alone or alongside other people, whichever they prefer that day.
        </p>
      </FadeIn>

      <FadeIn delay={0.3} className="relative">
        <p className="text-base leading-[1.75] text-zonein-ink mt-10">
          Ten desks today. Private offices, a meeting room, and locations beyond Lagos are the direction we're headed, not a promise with a date attached, but where this is going.
        </p>
      </FadeIn>
      </div>
    </div>
  );
}

export default AboutPage;
