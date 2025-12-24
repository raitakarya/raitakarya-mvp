# Raitakarya MVP - Quick Start Guide

## Get Up and Running in 5 Minutes! 🚀

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- Two terminal windows

### Step 1: Install Dependencies (2 minutes)

**Terminal 1 - Backend:**
```bash
cd /Users/prajwal/Desktop/raitakarya-mvp/backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd /Users/prajwal/Desktop/raitakarya-mvp/frontend
npm install
```

### Step 2: Configure Backend (1 minute)

Create `.env` file in backend folder:
```bash
cd /Users/prajwal/Desktop/raitakarya-mvp/backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/raitakarya"
JWT_SECRET="your-super-secret-key-change-this"
FRONTEND_URL="http://localhost:3000"
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

### Step 3: Setup Database (1 minute)

```bash
cd /Users/prajwal/Desktop/raitakarya-mvp/backend

# Create database (if it doesn't exist)
createdb raitakarya

# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### Step 4: Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd /Users/prajwal/Desktop/raitakarya-mvp/backend
npm run dev
```

You should see:
```
🚀 Raitakarya API running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd /Users/prajwal/Desktop/raitakarya-mvp/frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Step 5: Open Your Browser

Visit: **http://localhost:3000**

You should see the Raitakarya landing page!

---

## Quick Test Flow

### 1. Create a Farmer Account
1. Click "Sign Up"
2. Fill in details
3. Select "Farmer" as role
4. Click "Sign Up"

### 2. Post a Job
1. You'll be redirected to Farmer Dashboard
2. Click "Post New Job" tab
3. Fill in job details:
   - Title: "Rice Harvesting"
   - Description: "Need workers for rice harvesting"
   - Job Type: "Harvesting"
   - Location: "Punjab"
   - Wage: 500
   - Duration: 5 days
   - Workers Needed: 3
   - Start Date: Tomorrow's date
4. Click "Post Job"

### 3. Create a Worker Account
1. Open a new incognito/private window
2. Visit http://localhost:3000
3. Click "Sign Up"
4. Fill in details
5. Select "Agricultural Worker" as role
6. Click "Sign Up"

### 4. Apply to the Job
1. You'll see the job posted by the farmer
2. Click "Apply" button
3. Switch back to farmer window
4. Click "My Jobs" tab
5. You'll see the application
6. Click "Accept" to accept the worker

### Success! 🎉

You've just:
- Created two user accounts (Farmer & Worker)
- Posted a job listing
- Applied to a job
- Accepted an application

---

## Troubleshooting

### Database Connection Error
```
Error: Can't connect to database
```
**Solution:** Make sure PostgreSQL is running and DATABASE_URL is correct.

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Change PORT in backend/.env to a different port (e.g., 5001)

### Frontend Can't Connect to Backend
```
Error: Network Error
```
**Solution:** Make sure backend is running on port 5000 (or update VITE_API_URL in frontend/.env)

### Dependencies Not Installing
```
Error: npm install failed
```
**Solution:** Delete node_modules and package-lock.json, then run npm install again

---

## Useful Commands

### Backend Commands
```bash
cd backend

# Development
npm run dev              # Start with hot reload

# Database
npm run prisma:studio    # Open database GUI
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to DB
npm run prisma:migrate   # Create migration

# Production
npm run build           # Build for production
npm start               # Start production server
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev             # Start dev server

# Production
npm run build          # Build for production
npm run preview        # Preview production build

# Linting
npm run lint           # Run ESLint
```

---

## What's Included

### Backend API Endpoints

**Authentication:**
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

**Jobs:**
- GET `/api/jobs` - List all jobs
- POST `/api/jobs` - Create job (farmer)
- GET `/api/jobs/:id` - Get job details
- PUT `/api/jobs/:id` - Update job (farmer)
- DELETE `/api/jobs/:id` - Delete job (farmer)
- GET `/api/jobs/my-jobs` - Get my jobs (farmer)

**Applications:**
- POST `/api/applications` - Apply to job (worker)
- GET `/api/applications/my-applications` - My applications (worker)
- PUT `/api/applications/:id/status` - Update status (farmer)

**Users:**
- PUT `/api/users/profile` - Update profile
- PUT `/api/users/worker-profile` - Update worker profile
- PUT `/api/users/farmer-profile` - Update farmer profile
- GET `/api/users/:id` - Get user details

**Payments:**
- POST `/api/payments` - Create payment (farmer)
- PUT `/api/payments/:id/release` - Release payment (farmer)

**Ratings:**
- POST `/api/ratings` - Rate user
- GET `/api/ratings/user/:userId` - Get user ratings

### Frontend Pages

1. **Landing Page** (`/`) - Marketing page
2. **Login** (`/login`) - User login
3. **Signup** (`/signup`) - User registration
4. **Worker Dashboard** (`/worker/dashboard`) - Worker's main page
5. **Farmer Dashboard** (`/farmer/dashboard`) - Farmer's main page
6. **Job Details** (`/jobs/:id`) - Job details page
7. **Profile** (`/profile`) - User profile page

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/raitakarya"
JWT_SECRET="change-this-in-production"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Next Steps

1. **Test All Features**
   - Create multiple jobs
   - Apply as different workers
   - Accept/reject applications
   - Update profiles

2. **Customize**
   - Update colors in `frontend/tailwind.config.js`
   - Add your logo
   - Modify landing page content

3. **Deploy**
   - See SETUP.md for deployment instructions
   - Deploy to Vercel (frontend) + Render (backend)

4. **Extend**
   - Add image uploads
   - Implement payment gateway
   - Add real-time notifications
   - Add map view for jobs

---

## Support

For detailed documentation, see:
- `SETUP.md` - Complete setup guide
- `PROJECT_STRUCTURE.md` - Project overview
- `COMPLETION_SUMMARY.md` - Features list

---

**Happy Building! 🚀**

The Raitakarya MVP is ready to go. Start developing and make it your own!
