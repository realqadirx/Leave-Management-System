const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const session = require('express-session')

// Load environment variables FIRST
dotenv.config()

// Now import passport (which needs env variables)
const passport = require('./config/passport')

// Import routes
const authRoutes = require('./routes/auth')
const oauthRoutes = require('./routes/oauth')
const userRoutes = require('./routes/users')
const leaveRoutes = require('./routes/leaves')

const app = express()

// Middleware - CORS configuration for both local and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://teachtimeoff.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware (required for passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/auth', oauthRoutes) // OAuth routes (Google, GitHub)
app.use('/api/users', userRoutes)
app.use('/api/leaves', leaveRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 TechTimeOff API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login, me)',
      oauth: '/api/auth/google, /api/auth/github',
      users: '/api/users',
      leaves: '/api/leaves',
      health: '/api/health'
    },
    status: 'running'
  })
})

// API root route
app.get('/api', (req, res) => {
  res.json({ 
    message: '✅ TechTimeOff API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      oauth: {
        github: 'GET /api/auth/github',
        google: 'GET /api/auth/google'
      },
      users: 'GET /api/users',
      leaves: 'GET /api/leaves',
      health: 'GET /api/health'
    },
    status: 'running',
    timestamp: new Date().toISOString()
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TechTimeOff API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
})
