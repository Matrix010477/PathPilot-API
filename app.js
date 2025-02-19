const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// ✅ Updated MongoDB Connection (No Deprecated Options)
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ FastAPI AI Prediction Microservice Call
app.post("/api/predict", async (req, res) => {
  try {
    const { skills, interests } = req.body;

    // 🛑 Validate input
    if (!skills || !interests) {
      return res.status(400).json({ error: "Skills and Interests are required" });
    }

    // 📡 Send request to FastAPI server
    const response = await axios.post(`${process.env.AI_SERVICE_URL}/predict`, { skills, interests });

    res.json(response.data); // 📩 Send FastAPI response back to the client
  } catch (error) {
    console.error("❌ AI Service Error:", error.message);
    res.status(500).json({ error: "AI Prediction Service Error" });
  }
});

// ✅ Added Missing Route for GET Requests
app.get("/api/submitCareerData", (req, res) => {
  res.json({ message: "Career data submission endpoint is working!" });
});

// ✅ Added Basic Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", uptime: process.uptime() });
});

// ✅ Start the Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
