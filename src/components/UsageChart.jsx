import React, { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';

function UsageChart() {
  const { desks } = useBooking();
  const [chartData, setChartData] = useState({
    individualAvailable: 0,
    individualBooked: 0,
    teamAvailable: 0,
    teamBooked: 0
  });
  
  useEffect(() => {
    const individualDesks = desks.filter(desk => desk.type === 'individual');
    const teamDesks = desks.filter(desk => desk.type === 'team');
    
    setChartData({
      individualAvailable: individualDesks.filter(desk => desk.isAvailable).length,
      individualBooked: individualDesks.filter(desk => !desk.isAvailable).length,
      teamAvailable: teamDesks.filter(desk => desk.isAvailable).length,
      teamBooked: teamDesks.filter(desk => !desk.isAvailable).length
    });
  }, [desks]);
  
  const totalIndividualDesks = chartData.individualAvailable + chartData.individualBooked;
  const totalTeamDesks = chartData.teamAvailable + chartData.teamBooked;
  
  // Calculate percentages for the chart bars
  const individualBookedPercentage = totalIndividualDesks > 0 
    ? (chartData.individualBooked / totalIndividualDesks) * 100 
    : 0;
    
  const teamBookedPercentage = totalTeamDesks > 0 
    ? (chartData.teamBooked / totalTeamDesks) * 100 
    : 0;
  
  return (
    <div className="usage-chart">
      <h2>Desk Usage Chart</h2>
      
      <div className="chart-container">
        <div className="chart-type">
          <h3>Individual Desks</h3>
          <div className="chart-bar">
            <div 
              className="chart-bar-booked"
              style={{ width: `${individualBookedPercentage}%` }}
            >
              {chartData.individualBooked > 0 && `${chartData.individualBooked}`}
            </div>
            <div 
              className="chart-bar-available"
              style={{ width: `${100 - individualBookedPercentage}%` }}
            >
              {chartData.individualAvailable > 0 && `${chartData.individualAvailable}`}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color booked"></span>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <span className="legend-color available"></span>
              <span>Available</span>
            </div>
          </div>
        </div>
        
        <div className="chart-type">
          <h3>Team Desks</h3>
          <div className="chart-bar">
            <div 
              className="chart-bar-booked"
              style={{ width: `${teamBookedPercentage}%` }}
            >
              {chartData.teamBooked > 0 && `${chartData.teamBooked}`}
            </div>
            <div 
              className="chart-bar-available"
              style={{ width: `${100 - teamBookedPercentage}%` }}
            >
              {chartData.teamAvailable > 0 && `${chartData.teamAvailable}`}
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color booked"></span>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <span className="legend-color available"></span>
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsageChart;
