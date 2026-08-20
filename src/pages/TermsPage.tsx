import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import SEO from '../components/zonein/SEO';

function TermsPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <SEO
        title="Terms of Use | ZoneIn Hub"
        description="Terms of use for booking a coworking day pass desk at ZoneIn Hub in Alagbado, Lagos."
        path="/terms"
      />
      <FloatingShapes variant="cream" />
      <div className="relative max-w-2xl">
        <FadeIn>
          <h1 className="font-display font-bold text-[28px] text-zonein-ink mb-6">Terms of use</h1>
          <p className="text-[15px] leading-relaxed text-zonein-gray mb-4">
            A day pass reserves one desk for the stated date during opening hours (Monday to Saturday, 6am to 6pm). Bookings paid at the venue are held until the start of the day; unpaid no-shows may be released to walk-ins.
          </p>
          <p className="text-[15px] leading-relaxed text-zonein-gray mb-4">
            ZoneIn Hub does not provide shared computers, printing, or photocopying. Bring your own device. We are not responsible for personal belongings left unattended.
          </p>
          <p className="text-[15px] leading-relaxed text-zonein-gray">
            This is a placeholder terms document for design purposes and should be reviewed by counsel before going live.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

export default TermsPage;
