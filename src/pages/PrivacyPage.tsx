import { CONTACT } from '../utils/contact';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import SEO from '../components/zonein/SEO';

function PrivacyPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <SEO
        title="Privacy Policy | ZoneIn Hub"
        description="How ZoneIn Hub collects and uses your information when you book a coworking desk in Alagbado, Lagos."
        path="/privacy"
      />
      <FloatingShapes variant="cream" />
      <div className="relative max-w-2xl">
        <FadeIn>
          <h1 className="font-display font-bold text-[28px] text-zonein-ink mb-6">Privacy policy</h1>
          <p className="text-[15px] leading-relaxed text-zonein-gray mb-4">
            ZoneIn Hub collects your name and phone number to verify bookings by one-time code, and an email address if you ask to be notified about future offerings. We don't sell this information, and we only use it to run bookings and respond to you directly.
          </p>
          <p className="text-[15px] leading-relaxed text-zonein-gray mb-4">
            Booking records are kept for as long as needed to operate the space and resolve disputes, then deleted. You can ask us to remove your information at any time by contacting {CONTACT.email}.
          </p>
          <p className="text-[15px] leading-relaxed text-zonein-gray">
            This is a placeholder policy for design purposes and should be reviewed by counsel before going live.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}

export default PrivacyPage;
