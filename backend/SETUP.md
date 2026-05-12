# TechTimeOff Backend Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## Installation Steps

### 1. Install MongoDB

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Verify MongoDB is running:
```bash
mongosh
# Should connect to MongoDB shell
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- cors (Cross-origin resource sharing)
- dotenv (Environment variables)
- express-validator (Input validation)

### 3. Configure Environment Variables

The `.env` file is already created with default values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techtimeoff
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

**For production, change the JWT_SECRET to a secure random string!**

### 4. Seed the Database

Populate the database with test users:

```bash
node seed.js
```

This creates 4 test users:
- **Faculty**: faculty@jims.edu / faculty123
- **Coordinator**: coordinator@jims.edu / coord123
- **Chief Coordinator**: chief@jims.edu / chief123
- **Principal**: principal@jims.edu / principal123

### 5. Start the Backend Server

```bash
npm run dev
```

Or for production:
```bash
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server is running on http://localhost:5000
📊 Environment: development
```

## Frontend Setup

### 1. Update Frontend to Use API

The frontend is already configured to use the API. Make sure the backend is running before starting the frontend.

### 2. Start Frontend Development Server

```bash
# From the root directory (TechTimeoff)
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)
- `PUT /api/users/:id` - Update user (requires auth)

### Leaves
- `POST /api/leaves` - Create leave request (requires auth)
- `GET /api/leaves` - Get leave requests (requires auth)
- `GET /api/leaves/:id` - Get leave by ID (requires auth)
- `PUT /api/leaves/:id/approve` - Approve leave (coordinator+)
- `PUT /api/leaves/:id/reject` - Reject leave (coordinator+)
- `DELETE /api/leaves/:id` - Cancel leave (own requests only)

### Health Check
- `GET /api/health` - Check if API is running

## Testing the API

### Using cURL:

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faculty@jims.edu",
    "password": "faculty123",
    "role": "faculty"
  }'
```

#### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Faculty",
    "email": "newfaculty@jims.edu",
    "password": "password123",
    "role": "faculty",
    "department": "Computer Science",
    "employeeId": "FAC002"
  }'
```

### Using Postman or Insomnia:

Import the following endpoints and test them with appropriate request bodies.

## Database Schema

### User Model
- name (String, required)
- email (String, unique, required)
- password (String, hashed, required)
- role (Enum: faculty, coordinator, chief_coordinator, principal)
- department (String)
- employeeId (String, unique)
- phoneNumber (String)
- profileImage (String)
- leaveBalance (Object with leave types)
- isActive (Boolean)
- timestamps

### Leave Model
- user (ObjectId ref to User)
- leaveType (String)
- startDate (Date)
- endDate (Date)
- numberOfDays (Number)
- reason (String)
- status (Enum: Pending, Approved, Rejected, Cancelled)
- approvedBy (ObjectId ref to User)
- approverName (String)
- actionDate (Date)
- rejectionReason (String)
- attachment (String)
- timestamps

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
brew services start mongodb-community@7.0
# or
mongod --dbpath ~/data/db
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
npm install
```

### JWT Token Invalid
**Solution**: 
1. Clear browser localStorage
2. Login again to get a new token
3. Make sure JWT_SECRET in `.env` hasn't changed

## Production Deployment

### Environment Variables for Production:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techtimeoff
JWT_SECRET=<use a strong random string>
NODE_ENV=production
```

### Deploy to Services:
- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Database**: MongoDB Atlas (free tier available)
- **Frontend**: Vercel, Netlify, GitHub Pages

## Security Notes

1. ✅ Passwords are hashed using bcryptjs
2. ✅ JWT tokens expire after 7 days
3. ✅ Input validation on all endpoints
4. ✅ CORS enabled for frontend
5. ⚠️ Change JWT_SECRET in production
6. ⚠️ Use HTTPS in production
7. ⚠️ Implement rate limiting for production
8. ⚠️ Add refresh tokens for better security

## Support

For issues or questions:
1. Check the console logs for errors
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Check that ports 5000 (backend) and 5173 (frontend) are available

---

**Happy Coding! 🚀**
