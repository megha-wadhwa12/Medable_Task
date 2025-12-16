const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../../routes/auth");
const userRoutes = require("../../routes/users");
const secretStatsRoutes = require("../../routes/secret-stats");
const adminRoutes = require("../../routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// puzzle header
app.use((req, res, next) => {
  res.set("X-Secret-Challenge", "find_me_if_you_can_2024");
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users/secret-stats", secretStatsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// health
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports.handler = serverless(app);
