import React from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import DeskList from './components/DeskList.jsx';
import BookingForm from './components/BookingForm.jsx';
import BookingSummary from './components/BookingSummary.jsx';
import { BookingProvider } from './context/BookingContext.jsx';

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
          </div>
        </main>
        
        <Footer />
      </div>
    </BookingProvider>
  );
}

export default App;
