import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SpacePage from './pages/SpacePage';
import PricingPage from './pages/PricingPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AboutPage from './pages/AboutPage';
import LocationPage from './pages/LocationPage';
import FaqPage from './pages/FaqPage';
import FuturePage from './pages/FuturePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';
import { BookingProvider } from './context/BookingContext';

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-zonein-cream text-zonein-ink font-sans">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BookingProvider>
      <Routes>
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/space" element={<CustomerLayout><SpacePage /></CustomerLayout>} />
        <Route path="/pricing" element={<CustomerLayout><PricingPage /></CustomerLayout>} />
        <Route path="/booking" element={<CustomerLayout><BookingPage /></CustomerLayout>} />
        <Route path="/my-bookings" element={<CustomerLayout><MyBookingsPage /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
        <Route path="/location" element={<CustomerLayout><LocationPage /></CustomerLayout>} />
        <Route path="/faq" element={<CustomerLayout><FaqPage /></CustomerLayout>} />
        <Route path="/future" element={<CustomerLayout><FuturePage /></CustomerLayout>} />
        <Route path="/privacy" element={<CustomerLayout><PrivacyPage /></CustomerLayout>} />
        <Route path="/terms" element={<CustomerLayout><TermsPage /></CustomerLayout>} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BookingProvider>
  );
}

export default App;
