# EVENTRA - AI Powered Event Planning Marketplace

EVENTRA is a full-stack MERN application that connects Event Organizers with Service Providers. It features AI-powered recommendations, booking management, and real-time chat.

## Features

- **User Roles**: Event Organizer & Service Provider.
- **Authentication**: JWT-based secure login/registration.
- **Service Discovery**: Browse and book providers (Photographers, Caterers, etc.).
- **Dashboard**: 
  - Organizers: Manage events and bookings.
  - Providers: Manage portfolio and booking requests.
- **Real-time Chat**: Socket.io powered messaging.
- **AI Integrations**:
  - Service Suggestions based on event type.
  - Provider Matching.
  - Budget Optimization.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io.
- **Database**: MongoDB Atlas (or local).

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB installed locally or Atlas URI.

### Installation

1. **Clone the repository** (if applicable) or navigate to project root.

2. **Install Dependencies**:
   ```bash
   npm install      # Root dependencies (concurrently)
   cd server && npm install
   cd ../client && npm install
   ```

3. **Environment Setup**:
   - Create `.env` in `server/` directory:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/eventra_mock # Or your Atlas URI
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the Application**:
   From the root directory:
   ```bash
   npm start
   ```
   This will run both the backend (port 5000) and frontend (port 5173).

## Usage

1. Open `http://localhost:5173`.
2. Register as an **Organizer** to create events.
3. Register as a **Provider** to offer services.
4. Organizers can book Providers.
5. Providers can accept/reject bookings in their dashboard.

## Folder Structure

- `client/`: React frontend.
- `server/`: Express backend.
  - `models/`: Mongoose models.
  - `controllers/`: Request handlers (Auth, Event, Booking, Chat, AI).
  - `routes/`: API routes.
