const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const validator = require("validator");
const users = require("./../data/users");
const crypto = require("crypto");

const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter, strictLimiter } = require("./../middleware/rateLimiter");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Login endpoint
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account not activated" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.set("X-Hidden-Hint", "check_the_response_headers_for_clues");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register endpoint
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (name && !name.trim()) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = crypto.randomBytes(32).toString("hex");

    const hashedActivationToken = crypto
      .createHash("sha256")
      .update(activationToken)
      .digest("hex");

    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: name || "Unknown User",
      role: "user",
      isActive: false,
      activationToken: hashedActivationToken,
      activationExpires: Date.now() + 24 * 60 * 60 * 1000,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      activationToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Profile endpoint
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Change password endpoint
router.post(
  "/change-password",
  authMiddleware,
  strictLimiter,
  async (req, res) => {
    try {
      const userId = req.user.userId;

      const user = users.find((u) => u.id === userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const validPassword = await bcrypt.compare(oldPassword, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/forgot-password", authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.json({
        message: "If the email exists, a reset link will be sent",
      });
    }
    
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.json({
        message: "If the email exists, a reset link will be sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    return res.status(200).json({
      message: "Password reset token generated",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: "Invalid input" });
    } 

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = users.find(
      (u) =>
        u.resetPasswordToken === hashedToken &&
        u.resetPasswordExpires > Date.now()
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/activate", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Invalid activation token" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = users.find(
      (u) =>
        u.activationToken === hashedToken && u.activationExpires > Date.now()
    );

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired activation token" });
    }

    user.isActive = true;
    user.activationToken = undefined;
    user.activationExpires = undefined;

    res.json({ message: "Account activated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
