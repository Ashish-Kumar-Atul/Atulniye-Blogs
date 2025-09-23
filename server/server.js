const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://atulniye-blogs.onrender.com'], 
  credentials: true,              
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

app.use(session({
  secret: 'process.env.SESSION_SECRET', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }
}));

//Routes
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);

//MongoDB and start server
mongoose.connect(process.env.DB_URI).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err.message);
});
