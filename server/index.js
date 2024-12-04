const cors = require("cors");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const axios = require("axios");

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Set up session middleware
app.use(
  session({
    secret: "your_secret_key", // Change this secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Register route (forwarding to Flask URL)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Forward registration request to Flask app
    const response = await axios.post("http://xyz-url/register", { username, password });
    res.send(response.data);
  } catch (err) {
    console.error("Error connecting to Flask server for registration", err);
    res.status(500).send({ error: "Cannot access XYZ URL for registration" });
  }
});

// Login route (forwarding to Flask URL)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Forward login request to Flask app
    const response = await axios.post("http://xyz-url/login", { username, password });
    if (response.data.tasks) {
      req.session.user = response.data.username; // Store user info in session
      res.send({ tasks: response.data.tasks });
    } else {
      res.status(400).send({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error connecting to Flask server for login", err);
    res.status(500).send({ error: "Cannot access XYZ URL for login" });
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.send({ err });
    }
    res.redirect("/login");
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
