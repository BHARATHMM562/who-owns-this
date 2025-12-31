require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const teamRoutes = require('./routes/team');
const memberRoutes = require('./routes/members');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// CORS CONFIGURATION
// =======================
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost (development)
    if (origin.startsWith('http://localhost')) {
      return callback(null, true);
    }

    // Allow all Vercel deployments (production + previews)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.warn('CORS blocked request from:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// =======================
// MIDDLEWARE
// =======================
app.use(cors(corsOptions));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// =======================
// HEALTH CHECK
// =======================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// =======================
// API ROUTES
// =======================
app.use('/team', teamRoutes);
app.use('/members', memberRoutes);
app.use('/tasks', taskRoutes);

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// =======================
// MONGODB CONNECTION
// =======================
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// =======================
// GRACEFUL SHUTDOWN
// =======================
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// =======================
// START SERVER
// =======================
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 WHO OWNS THIS? Backend`);
    console.log(`   Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health\n`);
  });
};

startServer();
