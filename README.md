# Medicare Booking Platform

A full-stack web application for booking medical appointments, finding doctors and clinics, and managing healthcare interactions. Built with React, Node.js, Express, MongoDB, and Stripe.

## Features

-   **Find a Doctor:** Search, filter, and view detailed doctor profiles.
-   **Book Appointment:** Quick booking form and full booking workflow.
-   **Find a Location:** Interactive map with clinic locations and directions.
-   **User Dashboard:** Manage profile, bookings, and reviews.
-   **Doctor Dashboard:** Manage appointments, availability, patients, payments, and analytics.
-   **Payment System:** Secure payments via Stripe, receipts, and refund management.
-   **Notifications:** Real-time notifications for users and doctors.
-   **Reviews & Ratings:** Leave and view feedback for doctors.
-   **Admin Features:** (Optional) Manage users, doctors, and system data.

## Tech Stack

-   **Frontend:** React, Vite, Tailwind CSS, React Router, Recharts, @react-google-maps/api
-   **Backend:** Node.js, Express, MongoDB, Mongoose, Stripe
-   **Other:** JWT Auth, dotenv, React Query, ESLint

## Project Structure

-   `/frontend` — React app (UI, pages, components)
-   `/backend` — Node.js/Express API (routes, controllers, models)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Vanshsharma3330/Medicare-Booking.git
cd Medicare-Booking
```

### 2. Backend Setup

```bash
cd backend
npm install
```

-   Create a `.env` file in `/backend` with:
    ```env
    PORT=5000
    MONGO_URL=your_mongodb_url
    JWT_SECRET_key=your_jwt_secret
    STRIPE_SECRET_KEY=your_stripe_secret
    CLIENT_SITE_URL=http://localhost:5173
    ```
-   Start the backend:
    ```bash
    npm start
    # or for development with hot reload:
    npm run start-dev
    ```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

-   Create a `.env` file in `/frontend` with:
    ```env
    VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
    ```
-   Start the frontend:
    ```bash
    npm run dev
    ```
-   Visit [http://localhost:5173](http://localhost:5173)

## Environment Variables

-   **Backend:** MongoDB, JWT, Stripe, client URL
-   **Frontend:** Google Maps API key

## Contribution

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[ISC](LICENSE)
