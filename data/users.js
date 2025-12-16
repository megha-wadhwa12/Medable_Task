let users = [
  {
    id: "1",
    email: "admin@test.com",
    password: "$2a$10$BcCow1FK1kVdRiaFolAl9OOKJB/9eZbpL2fEMoSRt7rgeUxxNiZC6",
    name: "Admin User",
    role: "admin",
    isActive: true,
    createdAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    email: "user@test.com",
    password: "$2a$10$qHT2AjOcNsXJKPc4G8/yte1FOjTxKqYfCYh2KNF9xD8FbhPi0qO8u",
    name: "Regular User",
    role: "user",
    isActive: true,
    createdAt: new Date("2024-01-02").toISOString(),
  },
];

module.exports = users;
