import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import DeskList from './components/DeskList';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import UsageChart from './components/UsageChart';
import ExportBookings from './components/ExportBookings';
import { BookingProvider } from './context/BookingContext';

function App() {
  return (
    <BookingProvider>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <div className="container">
            <div className="app-grid">
              <DeskList />
              <BookingForm />
            </div>
            
            <BookingSummary />
            <UsageChart />
            <ExportBookings />
          </div>
        </main>
        
        <Footer />
      </div>
    </BookingProvider>
  );
}

export default App;
