// Single source of truth for per-route <title>/description, used both by the
// client-side <SEO> component and the build-time prerender script.
export interface SeoEntry {
  title: string;
  description: string;
}

export const SEO_MANIFEST: Record<string, SeoEntry> = {
  '/': {
    title: 'ZoneIn Hub | Coworking Day Pass Space in Alagbado, Lagos',
    description: 'Book a coworking day pass in Alagbado, Lagos. Stable power, reliable internet, and a calm, focused room to work in. Ten desks, walk-ins welcome, Monday to Saturday.',
  },
  '/space': {
    title: 'The Space | ZoneIn Hub Coworking, Alagbado Lagos',
    description: 'Take a full look at the ZoneIn Hub coworking space in Alagbado, Lagos: ten desks, stable power backup, reliable internet, and a calm room to work in.',
  },
  '/pricing': {
    title: 'Pricing | ZoneIn Hub Day Pass Coworking, Lagos',
    description: 'One simple day pass rate for coworking in Alagbado, Lagos. No subscriptions, no hidden fees. Book a desk online and pay as you come in.',
  },
  '/booking': {
    title: 'Book a Seat | ZoneIn Hub Coworking Space, Lagos',
    description: 'Pick a desk, choose a date, and book your coworking day pass at ZoneIn Hub in Alagbado, Lagos in minutes. No payment online, pay when you arrive.',
  },
  '/about': {
    title: 'About | ZoneIn Hub Coworking Space, Alagbado Lagos',
    description: 'ZoneIn Hub is a coworking day pass space in Alagbado, Lagos, built for tech professionals, freelancers, and remote workers who need a quiet place to work.',
  },
  '/location': {
    title: 'Location & Contact | ZoneIn Hub, Alagbado Lagos',
    description: 'Find ZoneIn Hub in Alagbado, Lagos: around Nightingale Academy, after Lizben Schools, off Amikanle. Address, hours, phone, WhatsApp, and email.',
  },
  '/faq': {
    title: 'FAQ | ZoneIn Hub Coworking Space, Lagos',
    description: 'Answers to common questions about booking a desk, walk-ins, opening hours, and what to expect at ZoneIn Hub coworking space in Alagbado, Lagos.',
  },
  '/future': {
    title: 'Private Offices & Meeting Room | ZoneIn Hub, Lagos',
    description: 'Private offices and a meeting room are coming soon to ZoneIn Hub in Alagbado, Lagos. Leave your email to be the first to know.',
  },
  '/privacy': {
    title: 'Privacy Policy | ZoneIn Hub',
    description: 'How ZoneIn Hub collects and uses your information when you book a coworking desk in Alagbado, Lagos.',
  },
  '/terms': {
    title: 'Terms of Use | ZoneIn Hub',
    description: 'Terms of use for booking a coworking day pass desk at ZoneIn Hub in Alagbado, Lagos.',
  },
};

// Routes that get prerendered to static HTML for crawlers/view-source.
// /my-bookings and /admin are deliberately excluded (private, noindex, and
// admin reads localStorage at render time which doesn't exist during SSR).
export const PRERENDER_ROUTES = Object.keys(SEO_MANIFEST);
