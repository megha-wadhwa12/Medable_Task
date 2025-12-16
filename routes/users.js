const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const users = require("./../data/users");

const router = express.Router();
router.use(authMiddleware);

// Get all users
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;

    let filteredUsers = users;

    if (search) {
      const lowerSearch = search.toLowerCase().trim();
      filteredUsers = users.filter(
        (u) =>
          u.email.toLowerCase().includes(lowerSearch) ||
          u.name.toLowerCase().includes(lowerSearch)
      );
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const safeLimit = limit > 50 ? 50 : limit;

    const startIndex = (page - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;

    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / safeLimit);
    res.set({
      "X-Total-Users": filteredUsers.length.toString(),
      "X-Secret-Endpoint": "/api/users/secret-stats",
    });

    res.json({
      page,
      limit: safeLimit,
      totalUsers: filteredUsers.length,
      totalPages,
      users: paginatedUsers.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
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

// Update user
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    delete updateData.role;
    delete updateData.password;

    users[userIndex] = { ...users[userIndex], ...updateData };

    res.json({
      message: "User updated successfully",
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.user.userId === req.params.userId) {
      return res.status(400).json({ error: "Cannot self-delete" });
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(userIndex, 1);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
