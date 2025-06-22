# StoreRatingApp

A full-stack web application for rating and reviewing stores, featuring three user roles: **Admin**, **Normal User**, and **Store Owner**.

- **Frontend:** React.js (Vite), React Router, Axios, custom CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT authentication, bcrypt password hashing

---

## Features

- **User Roles:**
  - **Admin:** Manage users and stores, view platform statistics
  - **Store Owner:** Register/login, manage their own store, view ratings
  - **Normal User:** Register/login, browse stores, rate and review stores

- **Authentication:**
  - Secure JWT-based authentication
  - Passwords hashed with bcrypt
  - Role-based access control and protected routes

- **Store & Rating System:**
  - Users can browse and rate stores (1-5 stars)
  - Store Owners can manage their store and view received ratings
  - Admins can manage all users and stores, and view platform stats

- **Modern Frontend:**
  - Built with React.js (Vite)
  - Uses React Context for authentication state
  - Responsive, clean UI with custom CSS 

- **RESTful API:**
  - Express.js backend with modular controllers and routes
  - MongoDB with Mongoose models for User, Store, and Rating

---

## Project Structure

```
store__rating/
  backend/      # Express.js API, MongoDB models, controllers, routes
  frontend/     # React.js (Vite) app, components, pages, CSS
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local )

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/store__rating.git
cd store__rating
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in `/backend` with the following variables:

  ```
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

- Start the backend server:

  ```bash
  npm start
  ```

- **Seeding the database:**
  - To import demo users, stores, and ratings:
    ```bash
    npm run seed
    ```
  - To destroy all data:
    ```bash
    npm run destroy
    ```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

- Start the frontend development server:

  ```bash
  npm run dev
  ```

- The app will be available at [http://localhost:5173] (default Vite port).

---

## Environment Variables

**Backend:**
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `PORT` — Backend server port (default: 5000)


---

## Main Packages Used

**Backend:**
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-async-handler
- nodemon (dev)

**Frontend:**
- react
- react-dom
- react-router-dom
- axios
- vite
- eslint (dev)

---

## Key Folders & Files

- `backend/models/` — Mongoose models: User, Store, Rating
- `backend/controllers/` — Route controllers for admin, auth, store, user
- `backend/routes/` — API route definitions
- `backend/seed.js` — Demo data seeding script
- `frontend/src/pages/` — Main app pages (Home, Login, Signup, Dashboards, Store, etc.)
- `frontend/src/components/` — Reusable UI components (Header, ProtectedRoute, StarRating, etc.)
- `frontend/src/context/AuthContext.jsx` — Auth state/context logic

---

## Usage Overview

- **Admin:**
  - Login at `/login/admin`
  - Access dashboard at `/admin/dashboard` to manage users, stores, and view stats
- **Store Owner:**
  - Login at `/login/store`
  - Access dashboard at `/store/dashboard` to manage their store and view ratings
- **Normal User:**
  - Login at `/login/user` or sign up at `/signup/user`
  - Browse stores at `/stores`, rate and review stores



## Acknowledgements

- [React.js](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

---

**Feel free to customize this README with your own screenshots, deployment instructions, or additional notes!** 