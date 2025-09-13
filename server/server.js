const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Use connect-mongo for production-safe sessions
const MongoStore = require("connect-mongo");

const blogRoutes = require("./routes/blogRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

// CORS setup (allow frontend during development + production)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL, // deployed frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Session setup with MongoStore for production
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store:
      process.env.NODE_ENV === "production"
        ? MongoStore.create({ mongoUrl: process.env.DB_URI })
        : undefined, // MemoryStore for dev
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// API Routes
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // __dirname points to /server
  const clientBuildPath = path.join(__dirname, "..", "client", "dist"); // Vite build folder
  app.use(express.static(clientBuildPath));

  // SPA fallback (catch-all)
  app.use((req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Connect MongoDB + Start server
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
