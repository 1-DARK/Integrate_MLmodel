import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"], // allow both Vite and React dev servers
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  })
);

app.use(express.json());

app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/predict", req.body);
    res.json(response.data);
  } catch (err) {
    console.error("Error calling ML model:", err.message);
    res.status(500).json({ error: "ML model request failed" });
  }
});

app.listen(3001, () => console.log("✅ Node.js server running on port 3001"));
