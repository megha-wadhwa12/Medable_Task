const express = require("express");
const authMiddleware = require("./../middleware/authMiddleware");
const users = require("./../data/users");

const router = express.Router();
router.use(authMiddleware);

router.get("/stats", async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }

    const totalUsers = users.length;
    const adminUsers = users.filter((u) => u.role === "admin").length;
    const regularUsers = users.filter((u) => u.role === "user").length;

    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
    };

    res.json({
      totalUsers: totalUsers,
      adminUsers: adminUsers,
      regularUsers: regularUsers,
      systemInfo: systemInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;