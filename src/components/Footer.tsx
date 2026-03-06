import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-blue-950 to-slate-950 text-blue-100/60 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">TECH-AGE <span className="text-blue-400">Hub</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Modern co-working spaces designed for productivity and collaboration.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors duration-300">Home</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors duration-300">Book a Space</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors duration-300">My Bookings</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Membership</h4>
            <ul className="space-y-2 text-sm">
              <li>Basic - $10/hr</li>
              <li>Premium - $15/hr</li>
              <li>Executive - $20/hr</li>
              <li>Team Desk - $25/hr</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Innovation Drive</li>
              <li>San Francisco, CA 94107</li>
              <li>hello@techage.hub</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm space-y-1">
          <p>&copy; {new Date().getFullYear()} TECH-AGE Hub. All rights reserved.</p>
          <p>
            Built by{' '}
            <a
              href="https://agedevs.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Gbolahan Akande
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
