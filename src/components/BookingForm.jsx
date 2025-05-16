import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/helpers';

function BookingForm() {
  const { selectedDesk, createBooking, calculateTotal } = useBooking();
  
  const [formData, setFormData] = useState({
    hours: 1,
    membershipTier: 'basic'
  });
  
  const [totalCost, setTotalCost] = useState(0);
  
  // Recalculate total cost when form data or selected desk changes
  useEffect(() => {
    if (selectedDesk) {
      const total = calculateTotal(
        formData.hours, 
        selectedDesk.type, 
        formData.membershipTier
      );
      setTotalCost(total);
    }
  }, [selectedDesk, formData, calculateTotal]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createBooking(formData);
    setFormData({ hours: 1, membershipTier: 'basic' });
  };
  
  if (!selectedDesk) {
    return (
      <div className="booking-form-container">
        <div className="empty-form-message">
          <p>Please select an available desk to book</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="booking-form-container">
      <h2>Book {selectedDesk.name}</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="hours">Hours to Book:</label>
          <input 
            type="number" 
            id="hours" 
            name="hours"
            min="1"
            max="24"
            value={formData.hours}
            onChange={handleChange}
            required
          />
        </div>
        
        {selectedDesk.type === 'individual' && (
          <div className="form-group">
            <label htmlFor="membershipTier">Membership Tier:</label>
            <select 
              id="membershipTier" 
              name="membershipTier"
              value={formData.membershipTier}
              onChange={handleChange}
              required
            >
              <option value="basic">Basic ($10/hour)</option>
              <option value="premium">Premium ($15/hour)</option>
              <option value="executive">Executive ($20/hour)</option>
            </select>
          </div>
        )}
        
        <div className="booking-summary">
          <div className="summary-item">
            <span>Desk Type:</span>
            <span>{selectedDesk.type === 'individual' ? 'Individual' : 'Team'}</span>
          </div>
          
          {selectedDesk.type === 'individual' && (
            <div className="summary-item">
              <span>Membership Tier:</span>
              <span className="capitalize">{formData.membershipTier}</span>
            </div>
          )}
          
          <div className="summary-item">
            <span>Hours:</span>
            <span>{formData.hours}</span>
          </div>
          
          <div className="summary-item total">
            <span>Total Cost:</span>
            <span>{formatCurrency(totalCost)}</span>
          </div>
        </div>
        
        <button type="submit" className="btn-primary">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
