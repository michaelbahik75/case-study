require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const User = require("./models/User");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// check
app.get("/", (req, res) => res.json({ message: "API is running" }));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Seed admin user on startup
const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@shop.com",
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
      });
      console.log("Admin user seeded");
    }
  } catch (error) {
    console.error("Admin seed error:", error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdmin();
});