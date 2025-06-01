# Medicare Booking Platform

A modern healthcare appointment booking platform that connects patients with top medical professionals. Built with React, Node.js, and Express.

## Features

-   🏥 **Doctor Search & Booking**: Find and book appointments with specialized doctors
-   📍 **Location Finder**: Locate nearby medical facilities
-   ⭐ **Doctor Ratings**: View detailed doctor profiles with ratings and reviews
-   🕒 **Real-time Availability**: Check and book available time slots
-   📱 **Responsive Design**: Access the platform from any device
-   🔒 **Secure Authentication**: Safe and secure user authentication system

## Tech Stack

### Frontend

-   React.js
-   Tailwind CSS
-   React Router
-   React Icons
-   Google Maps API

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   JWT Authentication

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn
-   MongoDB

### Installation

1. Clone the repository

```bash
git clone https://github.com/Vanshsharma3330/Medicare-Booking.git
cd Medicare-Booking
```

2. Install frontend dependencies

```bash
cd frontend
npm install
```

3. Install backend dependencies

```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory and add your environment variables:

```env
PORT=5000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the backend server

```bash
cd backend
npm start
```

2. Start the frontend development server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
medicare-booking-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── routes/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Vansh Sharma - [@Vanshsharma3330](https://github.com/Vanshsharma3330)

Project Link: [https://github.com/Vanshsharma3330/Medicare-Booking](https://github.com/Vanshsharma3330/Medicare-Booking)
