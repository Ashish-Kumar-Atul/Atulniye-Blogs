const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const blogRoutes = require("./routes/blogRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

// CORS setup (allow frontend during development + production)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "http://localhost:5174", // maybe another frontend port
      process.env.CLIENT_URL    // deployed frontend (Netlify/Vercel etc.)
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in prod (https)
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// API Routes
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname1, "client", "dist"))); // Vite build folder

  // SPA fallback
  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname1, "client", "dist", "index.html"));
  });
}


// MongoDB + Start server
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
