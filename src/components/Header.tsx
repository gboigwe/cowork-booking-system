import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Logo from './Logo';

const navLinks = [
  { to: '/space', label: 'The Space' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/booking', label: 'Book' },
  { to: '/about', label: 'About' },
  { to: '/location', label: 'Contact' },
];

function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (path: string) =>
    `text-[15px] font-medium transition-colors duration-150 ${
      location.pathname === path ? 'text-zonein-green-dark' : 'text-zonein-ink hover:text-zonein-green-dark'
    }`;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-zonein-cream border-b border-zonein-border"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[76px]">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className={linkClass(link.to)}>{link.label}</Link>
              ))}
            </div>
            <Link
              to="/booking"
              className="bg-zonein-green hover:bg-zonein-green-dark text-zonein-cream rounded-lg px-[22px] py-3 font-display font-semibold text-[15px] transition-colors duration-150"
            >
              Book a seat
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-zonein-ink block transition-transform ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-0.5 bg-zonein-ink block transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-zonein-ink block transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-zonein-border pt-4 pb-7 flex flex-col gap-5"
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-zonein-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setMobileOpen(false)}
              className="bg-zonein-green text-zonein-cream rounded-lg px-[22px] py-3.5 font-display font-semibold text-[15px] text-center w-full"
            >
              Book a seat
            </Link>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}

export default Header;
