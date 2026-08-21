import FaqAccordion from '../components/zonein/FaqAccordion';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import SEO from '../components/zonein/SEO';

const faqs = [
  { q: 'Do you have printing or photocopying?', a: 'No. ZoneIn Hub is a workspace, not a cyber café. Bring your laptop and everything you need on it.' },
  { q: 'What happens if there is a power or internet issue?', a: 'We run backup power and a dedicated internet line, so outages are rare. If something does go down, we will let you know at the desk and sort it out.' },
  { q: 'Can I just walk in?', a: 'Yes. Walk-ins are welcome whenever a desk is free. Booking ahead just guarantees your seat.' },
  { q: 'What are your hours?', a: 'Monday to Saturday, 6am to 6pm.' },
];

function FaqPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <SEO path="/faq" />
      <FloatingShapes variant="cream" />
      <div className="relative max-w-2xl">
        <FadeIn>
          <h1 className="font-display font-bold text-3xl sm:text-[38px] text-zonein-ink mb-10">FAQ</h1>
          <FaqAccordion items={faqs} />
        </FadeIn>
      </div>
    </div>
  );
}

export default FaqPage;
