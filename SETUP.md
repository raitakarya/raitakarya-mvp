# Raitakarya MVP - Setup Guide

## Project Overview

Raitakarya is a full-stack web application connecting farmers with agricultural workers. This MVP includes:

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Zustand

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and update with your database credentials:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/raitakarya"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="http://localhost:3000"
```

### 4. Setup database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# OR run migrations (for production)
npm run prisma:migrate
```

### 5. Start the backend server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

Backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (optional)

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

The default API URL is `http://localhost:5000/api`

### 4. Start the frontend development server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (farmers only)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (farmers only)
- `DELETE /api/jobs/:id` - Delete job (farmers only)
- `GET /api/jobs/my-jobs` - Get farmer's jobs (farmers only)

### Applications
- `POST /api/applications` - Apply to job (workers only)
- `GET /api/applications/my-applications` - Get worker's applications (workers only)
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id/status` - Update application status (farmers only)

### Users
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/worker-profile` - Update worker profile (workers only)
- `PUT /api/users/farmer-profile` - Update farmer profile (farmers only)
- `GET /api/users/:id` - Get user by ID

### Payments
- `POST /api/payments` - Create payment (farmers only)
- `PUT /api/payments/:id/release` - Release payment (farmers only)
- `GET /api/payments/:id` - Get payment by ID

### Ratings
- `POST /api/ratings` - Create/update rating
- `GET /api/ratings/user/:userId` - Get ratings for user
- `DELETE /api/ratings/:id` - Delete rating

## User Roles

### Worker
- Browse and search for jobs
- Apply to jobs
- View application status
- Track earnings and job history

### Farmer
- Post job listings
- Review applications
- Accept/reject applicants
- Manage payments
- Rate workers

## Features Implemented

### Backend
- ✅ User authentication (JWT)
- ✅ Role-based access control (RBAC)
- ✅ Job posting and management
- ✅ Application system
- ✅ Payment escrow system
- ✅ Rating system
- ✅ Profile management

### Frontend
- ✅ Landing page
- ✅ Login/Signup
- ✅ Worker dashboard
- ✅ Farmer dashboard
- ✅ Job listings and details
- ✅ Application management
- ✅ Profile page
- ✅ Responsive design with Tailwind CSS
- ✅ State management with Zustand

## Database Schema

### Models
- **User** - Core user model
- **WorkerProfile** - Worker-specific data
- **FarmerProfile** - Farmer-specific data
- **Job** - Job listings
- **Application** - Job applications
- **Payment** - Payment transactions
- **Rating** - User ratings

## Development Tips

### Running both servers concurrently

Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```

### Database Management

```bash
# Open Prisma Studio (database GUI)
cd backend
npm run prisma:studio
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### Port Already in Use
- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env

### CORS Errors
- Verify FRONTEND_URL in backend/.env matches your frontend URL
- Check that both servers are running

## Next Steps

1. Set up a production database (e.g., Supabase, Neon, Railway)
2. Deploy backend to a hosting service (Render, Railway, Fly.io)
3. Deploy frontend to Vercel/Netlify
4. Add environment variables to deployment platforms
5. Enable SSL/HTTPS
6. Implement Razorpay payment integration
7. Add image upload functionality
8. Implement real-time notifications

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod (optional)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.
