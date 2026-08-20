import { Link } from 'react-router-dom';
import { DAY_RATE_NGN } from '../context/BookingContext';
import { formatNaira } from '../utils/helpers';
import FaqAccordion from '../components/zonein/FaqAccordion';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import SEO from '../components/zonein/SEO';

const pricingFaqs = [
  { q: 'Is the day pass per calendar day or 24 hours?', a: 'Per calendar day, for the hours we are open: Monday to Saturday, 6am to 6pm.' },
  { q: 'Can I pay at the venue?', a: 'Yes. Choose "pay at the venue" at checkout and settle up when you arrive.' },
  { q: 'Are memberships available yet?', a: 'Not yet. Weekly and monthly passes are planned. The day pass is available now.' },
];

function PricingPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <SEO
        title="Pricing | ZoneIn Hub Day Pass Coworking, Lagos"
        description="One simple day pass rate for coworking in Alagbado, Lagos. No subscriptions, no hidden fees. Book a desk online and pay as you come in."
        path="/pricing"
      />
      <FloatingShapes variant="cream" />

      <FadeIn className="relative">
        <h1 className="font-display font-bold text-3xl sm:text-[42px] text-zonein-ink mb-3">Pricing</h1>
        <p className="text-base text-zonein-gray mb-12 max-w-md">One simple rate. Pay as you come in.</p>
      </FadeIn>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mb-14">
        <FadeIn delay={0}>
          <div className="border-2 border-zonein-green rounded-2xl p-9 bg-zonein-cream">
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-zonein-green-dark mb-4">Day pass</p>
            <h2 className="font-display font-bold text-[44px] text-zonein-ink mb-6">
              {formatNaira(DAY_RATE_NGN)}<span className="text-base font-medium text-zonein-gray"> / day</span>
            </h2>
            <div className="flex flex-col gap-3 mb-8">
              <p className="text-sm text-zonein-ink">A desk for the day, 6am - 6pm</p>
              <p className="text-sm text-zonein-ink">Stable power and reliable internet</p>
              <p className="text-sm text-zonein-ink">Access to the shared room</p>
            </div>
            <Link to="/booking"
              className="block text-center bg-zonein-green hover:bg-zonein-green-dark text-zonein-cream font-display font-semibold rounded-lg py-3.5 transition-colors"
            >
              Book a seat
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="border border-zonein-border rounded-2xl p-9 opacity-70">
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-zonein-gray mb-4">Weekly / monthly (coming soon)</p>
            <h2 className="font-display font-bold text-2xl text-zonein-gray mb-6">Membership</h2>
            <p className="text-sm leading-relaxed text-zonein-gray">
              Recurring passes for regulars are on the way. The day pass covers everything for now.
            </p>
          </div>
        </FadeIn>
      </div>

      <FadeIn className="relative">
        <h2 className="font-display font-semibold text-[22px] text-zonein-ink mb-5">Pricing questions</h2>
        <div className="max-w-xl">
          <FaqAccordion items={pricingFaqs} />
        </div>
      </FadeIn>
    </div>
  );
}

export default PricingPage;
