const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const mongoURI = "mongodb+srv://vicvic1328:WOifwSp52hrK5A8F@conuhacksinterview.wxee1.mongodb.net/?retryWrites=true&w=majority&appName=ConUHacksInterview";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas:", err));

// Define a schema for user responses
const responseSchema = new mongoose.Schema({
  question: String,
  answer: String,
  timestamp: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);

// API endpoint to save user responses
app.post("/api/save-response", async (req, res) => {
  const { question, answer } = req.body;

  try {
    const newResponse = new Response({ question, answer });
    await newResponse.save();
    res.status(201).json({ message: "Response saved successfully!" });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ message: "Failed to save response." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});