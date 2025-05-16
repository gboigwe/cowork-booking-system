import React from 'react';
import { useBooking } from '../context/BookingContext';

function DeskItem({ desk }) {
  const { selectDesk, selectedDesk } = useBooking();
  
  const handleSelect = () => {
    if (desk.isAvailable) {
      selectDesk(desk.id);
    }
  };
  
  const isSelected = selectedDesk && selectedDesk.id === desk.id;
  
  return (
    <div 
      className={`desk-item ${desk.isAvailable ? 'available' : 'booked'} ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="desk-info">
        <h3>{desk.name}</h3>
        <span className="desk-type">{desk.type}</span>
        <span className="desk-status">
          {desk.isAvailable ? 'Available' : 'Booked'}
        </span>
      </div>
    </div>
  );
}

export default DeskItem;
