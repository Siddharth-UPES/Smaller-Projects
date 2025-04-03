const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/crudDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema and Model
const Item = mongoose.model(
  "Item",
  new mongoose.Schema({
    name: { type: String, required: true },
  })
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // To handle JSON requests
app.use(express.static("public"));

// Routes
// Home Page (Read Operation)
app.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.send(`
      <h1>CRUD App with MongoDB</h1>
      <form action="/add" method="POST">
        <input type="text" name="name" placeholder="Enter item" required />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        ${items
          .map(
            (item) => `
          <li>
            ${item.name} 
            <a href="/delete/${item._id}" onclick="return confirm('Are you sure?')">Delete</a> 
            <form action="/update/${item._id}" method="POST" style="display:inline;">
              <input type="text" name="name" placeholder="New name" required />
              <button type="submit">Update</button>
            </form>
          </li>
        `
          )
          .join("")}
      </ul>
    `);
  } catch (error) {
    res.status(500).send("Error fetching items.");
  }
});

// Create 
app.post("/add", async (req, res) => {
  try {
    await Item.create({ name: req.body.name });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding item.");
  }
});

// Update 
app.post("/update/:id", async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, { name: req.body.name });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error updating item.");
  }
});

// Delete 
app.get("/delete/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting item.");
  }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/* 🔹 Instructions to Run:
1. Ensure MongoDB is running locally.
2. Install dependencies: npm init -y && npm install express mongoose body-parser
3. Run server: node app.js
4. Open browser: http://localhost:3000
*/
