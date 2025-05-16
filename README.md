# Co-working Space Booking System

## Project Overview
This is a React-based application for managing bookings in a co-working space. The system allows users to book individual or team desks with different pricing based on membership tiers.

### Features
- View all available desks (10 individual and 5 team desks)
- Book individual desks with membership tier selection (Basic, Premium, Executive)
- Book team desks at a fixed rate
- View booking summaries including desk type, duration, and total cost
- Data persistence using localStorage to maintain bookings across sessions

## Tech Stack
- React.js
- JavaScript
- Local Storage for data persistence
- CSS for responsive styling

## Folder Structure

cowork-booking-system/
├── public/
│   ├── index.html
│   ├── favicon.ico
├── src/
│   ├── components/
│   │   ├── DeskList.js
│   │   ├── DeskItem.js
│   │   ├── BookingForm.js
│   │   ├── BookingSummary.js
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── context/
│   │   └── BookingContext.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
└── .gitignore

## Setup Instructions
1. Clone the repository
   ```
   git clone https://github.com/gboigwe/cowork-booking-system.git
   cd cowork-booking-system
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide
1. Browse available desks in the desk listing section
2. Select a desk to book by clicking on it
3. Fill out the booking form:
   - For individual desks: Select membership tier (Basic, Premium, Executive)
   - For team desks: No tier selection needed
   - Enter the number of hours you want to book
4. Submit the form to complete your booking
5. View your booking summary

## Deployment
The application is deployed on pending....
