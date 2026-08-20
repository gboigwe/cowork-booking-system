import { Link } from 'react-router-dom';
import Logo from './Logo';
import { CONTACT } from '../utils/contact';

function Footer() {
  return (
    <footer className="border-t border-zonein-border pt-12 sm:pt-16 pb-8 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Logo tagline />
            <p className="text-sm leading-relaxed text-zonein-gray mt-4 max-w-[220px]">
              A quiet place to get work done, in {CONTACT.addressShort}.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-1">Explore</span>
            <Link to="/space" className="text-sm text-zonein-ink hover:text-zonein-green-dark">The Space</Link>
            <Link to="/pricing" className="text-sm text-zonein-ink hover:text-zonein-green-dark">Pricing</Link>
            <Link to="/booking" className="text-sm text-zonein-ink hover:text-zonein-green-dark">Book a seat</Link>
            <Link to="/my-bookings" className="text-sm text-zonein-ink hover:text-zonein-green-dark">My bookings</Link>
            <Link to="/faq" className="text-sm text-zonein-ink hover:text-zonein-green-dark">FAQ</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-1">About</span>
            <Link to="/about" className="text-sm text-zonein-ink hover:text-zonein-green-dark">Our story</Link>
            <Link to="/future" className="text-sm text-zonein-ink hover:text-zonein-green-dark">Private offices &amp; meeting room</Link>
            <Link to="/location" className="text-sm text-zonein-ink hover:text-zonein-green-dark">Location &amp; contact</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-zonein-gray uppercase tracking-[0.04em] mb-1">Reach us</span>
            <a href={`tel:${CONTACT.phoneTel}`} className="text-sm text-zonein-ink hover:text-zonein-green-dark">{CONTACT.phoneDisplay}</a>
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-zonein-ink hover:text-zonein-green-dark">WhatsApp</a>
            <a href={`mailto:${CONTACT.email}`} className="text-sm text-zonein-ink hover:text-zonein-green-dark">{CONTACT.email}</a>
          </div>
        </div>

        <div className="border-t border-zonein-border pt-6 flex flex-wrap justify-between items-center gap-3">
          <span className="text-[13px] text-zonein-gray">© {new Date().getFullYear()} ZoneIn Hub</span>
          <div className="flex gap-5 items-center">
            <Link to="/privacy" className="text-[13px] text-zonein-gray hover:text-zonein-green-dark">Privacy</Link>
            <Link to="/terms" className="text-[13px] text-zonein-gray hover:text-zonein-green-dark">Terms</Link>
            <Link to="/admin" className="text-[13px] text-zonein-gray hover:text-zonein-green-dark">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
