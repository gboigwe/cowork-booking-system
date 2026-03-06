import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === '/';

  const linkClass = (path: string) =>
    `text-sm font-medium transition-all duration-300 ${
      location.pathname === path
        ? isHome ? 'text-white' : 'text-blue-600'
        : isHome ? 'text-blue-100/80 hover:text-white' : 'text-gray-500 hover:text-gray-900'
    }`;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHome
          ? 'bg-white/5 backdrop-blur-xl border-b border-white/10'
          : 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
              isHome ? 'bg-white/15 backdrop-blur-sm border border-white/20' : 'bg-blue-600 shadow-lg shadow-blue-200'
            }`}>
              <svg className={`w-5 h-5 ${isHome ? 'text-white' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${isHome ? 'text-white' : 'text-gray-900'}`}>
              TECH-AGE <span className={isHome ? 'text-blue-300' : 'text-blue-600'}>Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/booking" className={linkClass('/booking')}>Book a Space</Link>
            <Link to="/my-bookings" className={linkClass('/my-bookings')}>My Bookings</Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          </nav>

          <Link
            to="/booking"
            className={`hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
              isHome
                ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200/50'
            }`}
          >
            Book Now
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isHome ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:hidden pb-4 flex flex-col gap-2 ${
              isHome ? 'border-t border-white/10' : 'border-t border-gray-100'
            } pt-3`}
          >
            {[
              { to: '/', label: 'Home' },
              { to: '/booking', label: 'Book a Space' },
              { to: '/my-bookings', label: 'My Bookings' },
              { to: '/dashboard', label: 'Dashboard' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? isHome ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'
                    : isHome ? 'text-blue-100/80 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}

export default Header;
