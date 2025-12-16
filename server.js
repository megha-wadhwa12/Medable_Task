const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const secretStatsRoutes = require("./routes/secret-stats");
const adminStatRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Custom headers for puzzle hints
app.use((req, res, next) => {
  res.set({
    "X-Secret-Challenge": "find_me_if_you_can_2024",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  });
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users/secret-stats", secretStatsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminStatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((error, req, res, next) => {
  res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
