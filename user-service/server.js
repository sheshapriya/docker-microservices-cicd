const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected (User Service)"))
  .catch((err) => console.log("Mongo Error:", err));

app.get("/health", (req, res) => res.json({ status: "ok", service: "user-service" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(5001, () => console.log("User Service running on port 5001"));