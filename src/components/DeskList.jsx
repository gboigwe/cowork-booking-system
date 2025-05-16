import React from 'react';
import DeskItem from './DeskItem';
import { useBooking } from '../context/BookingContext';

function DeskList() {
  const { desks } = useBooking();
  
  const individualDesks = desks.filter(desk => desk.type === 'individual');
  const teamDesks = desks.filter(desk => desk.type === 'team');
  
  return (
    <section className="desk-list-section">
      <h2>Available Desks</h2>
      
      <div className="desk-category">
        <h3>Individual Desks</h3>
        <div className="desk-grid">
          {individualDesks.map(desk => (
            <DeskItem key={desk.id} desk={desk} />
          ))}
        </div>
      </div>
      
      <div className="desk-category">
        <h3>Team Desks</h3>
        <div className="desk-grid">
          {teamDesks.map(desk => (
            <DeskItem key={desk.id} desk={desk} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DeskList;
