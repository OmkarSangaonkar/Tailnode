const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

YOUR_APP_ID = "6513de9f2a8784fe41313938";

// Set up MongoDB connection using Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/dummyapi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

// Create a User model for MongoDB
const User = mongoose.model("User", {
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  // Add more fields as per the API response
});

// Create a Post model for MongoDB
const Post = mongoose.model("Post", {
  userId: String,
  id: String,
  title: String,
  body: String,
  // Add more fields as per the API response
});

// API to fetch and store users
app.get("/fetch-users", async (req, res) => {
  try {
    const axios = require("axios");
    const response = await axios.get("https://dummyapi.io/data/v1/user", {
      headers: {
        "app-id": YOUR_APP_ID, // Replace with your actual app_id you can actually put it in .env
      },
    });

    const users = response.data.data;

    // Save users to the database
    await User.insertMany(users);

    res.status(200).json({ message: "Users fetched and saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API to fetch and store user's posts
app.get("/fetch-posts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const axios = require("axios");
    const response = await axios.get(
      `https://dummyapi.io/data/v1/user/${userId}/post`,
      {
        headers: {
          "app-id": YOUR_APP_ID, // Replace with your actual app_id
        },
      }
    );

    const posts = response.data.data;

    // Save user's posts to the database
    await Post.insertMany(posts);

    res
      .status(200)
      .json({ message: "User posts fetched and saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
