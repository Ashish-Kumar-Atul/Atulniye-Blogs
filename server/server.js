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
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL, // frontend deployed URL
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store:
      process.env.NODE_ENV === "production"
        ? MongoStore.create({ mongoUrl: process.env.DB_URI })
        : undefined,
    cookie: {
      // For cross-origin cookies in production, must be 'none' and secure
      secure: process.env.NODE_ENV === "production", // true for HTTPS
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

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
