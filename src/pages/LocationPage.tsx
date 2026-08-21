import { CONTACT } from '../utils/contact';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import SEO from '../components/zonein/SEO';

function LocationPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <SEO path="/location" />
      <FloatingShapes variant="cream" />

      <FadeIn className="relative">
        <h1 className="font-display font-bold text-3xl sm:text-[38px] text-zonein-ink mb-10">Location &amp; contact</h1>
      </FadeIn>

      <div className="relative grid lg:grid-cols-[1fr_1.3fr] gap-10 items-start">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-2">Address</p>
              <p className="text-base leading-relaxed text-zonein-ink">
                {CONTACT.addressLine1}<br />
                {CONTACT.addressLine2}<br />
                {CONTACT.addressLine3}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-2">Landmarks</p>
              <ul className="text-base leading-relaxed text-zonein-ink list-disc list-inside">
                {CONTACT.landmarks.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-2">Hours</p>
              <p className="text-base leading-relaxed text-zonein-ink">{CONTACT.hours}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-2">Phone / WhatsApp</p>
              <a href={`tel:${CONTACT.phoneTel}`} className="text-base text-zonein-ink hover:text-zonein-green-dark block mb-1">{CONTACT.phoneDisplay}</a>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-base text-zonein-ink hover:text-zonein-green-dark">Message on WhatsApp</a>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-2">Email</p>
              <a href={`mailto:${CONTACT.email}`} className="text-base text-zonein-ink hover:text-zonein-green-dark">{CONTACT.email}</a>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="w-full h-[360px] rounded-2xl overflow-hidden border border-zonein-border">
            <iframe
              title="ZoneIn Hub location"
              src={CONTACT.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default LocationPage;
