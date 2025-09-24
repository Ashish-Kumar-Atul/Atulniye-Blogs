const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo'); // <-- IMPORT MongoStore
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: [
    'https://atulniye-blogs.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-fallback',
  resave: false,
  saveUninitialized: false,
  // ✅ Store sessions in MongoDB
  store: MongoStore.create({
    mongoUrl: process.env.DB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // true on Render (HTTPS)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);

// MongoDB and start server
mongoose.connect(process.env.DB_URI).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err.message);
});