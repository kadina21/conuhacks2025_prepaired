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

const authSchema = new mongoose.Schema({
    username: String,
    password: String,
  });

const Response = mongoose.model("Response", responseSchema);

const Auth = mongoose.model("Auth", authSchema); //to create

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

// API endpoint to save user responses
app.post("/api/sign-up", async (req, res) => {
    const { question, answer } = req.body;
  
    try {
      const newAuth = new Auth({ username, password });
      await newAuth.save();
      res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Failed to create account." });
    }
});


// API endpoint to log a user to the website
app.get("/api/login", async (req, res) => {
  const { username, password } = req.query;

  try {
    const user = await Auth.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});