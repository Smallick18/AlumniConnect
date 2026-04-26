# AlumniConnect

AlumniConnect is a full-stack alumni networking platform built with React, Vite, Node.js, Express, MongoDB, and Socket.io.
It helps students and alumni connect, share events, send direct messages, and participate in group chat rooms.

## Key Features

- User registration and login with JWT authentication
- Student / Alumni role support
- User profile creation and profile picture upload
- Automatic promotion from Student to Alumni when graduation year passes
- Real-time direct chat for one-to-one messaging
- Group chat rooms for topic-based conversations (e.g. `mentorship`)
- Alumni directory and public profile viewing
- Event management and auto-removal of expired events
- Connection requests and relationship management

## Tech Stack

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - React Router
  - Axios
  - Socket.io Client
- Backend:
  - Node.js
  - Express
  - MongoDB / Mongoose
  - Socket.io
  - JWT authentication
  - bcryptjs for password hashing
  - node-schedule for background cleanup jobs

## Repository Structure

- `backend/` - Express API server, MongoDB models, authentication, real-time chat setup, and scheduling logic
- `frontend/` - React application with pages for login, profile, chat, events, network, requests, and dashboard

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Smallick18/AlumniConnect.git
cd AlumniConnect
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Then start the backend server:

```bash
npm run dev
```

### 3. Frontend setup

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend should run on `http://localhost:5173` and the backend on `http://localhost:5000` during local development.

For production, set `VITE_API_URL` to your deployed backend URL in Vercel/Vite environment settings. For example:

```bash
VITE_API_URL=https://your-backend-render-app.onrender.com
```

## Usage

- Register as a student, alumni, or faculty member
- Create/update your profile with bio, skills, graduation year, and profile photo
- Use the group chat page to join a common room and chat with everyone in that room
- Use direct chat to message individual alumni or students
- Browse the alumni directory to view public profiles
- Create and view events, and send/receive connection requests

## Notes

- The backend automatically promotes users from `Student` to `Alumni` when `graduationYear <= current year`.
- Profile photos can be uploaded from the device and are shown in the account sidebar and profile pages.
- The backend uses Socket.io for real-time chat updates.

## Future Improvements

- Add image upload storage instead of data-URI profile image handling
- Add better room management and permissions for group chat
- Add notifications for messages and requests
- Improve mobile responsiveness and UI polish

---

Feel free to use this README as a starting point. You can adapt the description, features, and setup steps to match your final deployment flow.