import React from 'react';
import DeskItem from './DeskItem';
import { useBooking } from '../context/BookingContext';

function DeskList() {
  const { desks } = useBooking();
  
  // Separate individual and team desks
  const individualDesks = desks.filter(desk => desk.type === 'individual');
  const teamDesks = desks.filter(desk => desk.type === 'team');
  
  return (
    <section className="desk-list-section">
      <h2>Available Desks</h2>
      
      <div className="desk-category">
        <h3>Individual Desks</h3>
        <p>Choose from Basic ($10/hr), Premium ($15/hr), or Executive ($20/hr) tiers</p>
        <div className="desk-grid">
          {individualDesks.map(desk => (
            <DeskItem key={desk.id} desk={desk} />
          ))}
        </div>
      </div>
      
      <div className="desk-category">
        <h3>Team Desks</h3>
        <p>Fixed rate: $25/hr</p>
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
