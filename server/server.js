const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Only install this if you want production-safe sessions
// npm install connect-mongo
const MongoStore = require("connect-mongo");

const blogRoutes = require("./routes/blogRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL, // frontend deployed URL
      "https://atulniye-blogs.onrender.com", // Same domain (for when serving frontend from backend)
      "http://localhost:5173",
      "http://localhost:5174",
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

app.use(express.json());

// Add middleware to log request headers for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.path === '/api/auth/status') {
      console.log('=== Auth Status Request ===');
      console.log('Headers:', req.headers);
      console.log('Cookies:', req.headers.cookie);
      console.log('Session ID from cookie:', req.sessionID);
    }
    next();
  });
}

// Session setup
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Simplified cookie settings for better cross-origin support
    secure: false, // Set to false for now to test
    httpOnly: false, // Set to false for debugging
    sameSite: 'lax', // Use lax instead of none
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  name: 'sessionId', // Custom session name
};

// Only add MongoDB store if in production and DB_URI is available
if (process.env.NODE_ENV === "production" && process.env.DB_URI) {
  try {
    sessionConfig.store = MongoStore.create({ 
      mongoUrl: process.env.DB_URI,
      touchAfter: 24 * 3600, // lazy session update
      ttl: 60 * 60 * 24 * 7, // 7 days
    });
    console.log('MongoDB session store configured');
  } catch (error) {
    console.error('Failed to configure MongoDB session store:', error);
    console.log('Falling back to memory store');
  }
} else {
  console.log('Using memory session store');
}

app.use(session(sessionConfig));

// API routes
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientBuildPath));

  app.use((req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Connect to MongoDB + start server
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
