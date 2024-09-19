import express from "express";
import db from "../utils/db.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a new property
router.post("/add", verifyToken, (req, res) => {
    const { title, description, price, location } = req.body;
    const userID = req.user.userID;
  
    console.log("User ID from JWT:", userID); // Debugging line
  
    if (!userID) {
      console.log("User ID is null"); // Debugging line
      return res.status(400).json({ Status: "Error", Error: "User ID not found" });
    }
  
    const query = 'INSERT INTO properties (userID, title, description, price, location) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userID, title, description, price, location], (err) => {
      if (err) return res.json({ Status: 'Error', Error: err.message });
      res.json({ Status: 'Success' });
    });
  });

// Update a property by ID
router.put("/edit/:id", verifyToken, (req, res) => {
  const propertyID = req.params.id;
  const { title, description, price, location } = req.body;
  const query = "UPDATE properties SET title = ?, description = ?, price = ?, location = ? WHERE id = ? AND userID = ?";
  db.query(query, [title, description, price, location, propertyID, req.user.userID], (err, results) => {
    if (err) return res.json({ Status: "Error", Error: err.message });
    if (results.affectedRows === 0) return res.json({ Status: "Error", Error: "No rows updated" });
    res.json({ Status: "Success" });
  });
});


// Fetch all properties for a landing page
router.get("/forsale", (req, res) => {
  const query = 'SELECT * FROM properties';
  db.query(query, (err, results) => {
    if (err) return res.json({ Status: 'Error', Error: err.message });
    res.json({ Status: 'Success', properties: results });
  });
});

// Fetch all properties for a user
router.get("/user/:userID", verifyToken, (req, res) => {
  const userID = req.params.userID;
  const query = 'SELECT * FROM properties WHERE userID = ?';
  db.query(query, [userID], (err, results) => {
    if (err) return res.json({ Status: 'Error', Error: err.message });
    res.json({ Status: 'Success', properties: results });
  });
});

// Fetch all properties (Admin use)
router.get("/", verifyToken, adminOnly, (req, res) => {
  db.query('SELECT * FROM properties', (err, results) => {
    if (err) return res.json({ Status: 'Error', Error: err.message });
    res.json({ Status: 'Success', properties: results });
  });
});

// Fetch a single property by ID
router.get("/:id", verifyToken, (req, res) => {
  db.query('SELECT * FROM properties WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.json({ Status: 'Error', Error: err.message });
    if (results.length === 0) return res.json({ Status: 'Error', Error: 'Property not found' });
    res.json({ Status: 'Success', property: results[0] });
  });
});

// Update a property (only for the user who owns the property)
router.put("/:id", verifyToken, (req, res) => {
  const { title, description, price, location } = req.body;
  const userID = req.user.id;
  const query = 'UPDATE properties SET title = ?, description = ?, price = ?, location = ? WHERE id = ? AND userID = ?';
  db.query(query, [title, description, price, location, req.params.id, userID], (err) => {
    if (err) return res.json({ Status: 'Error', Error: err.message });
    res.json({ Status: 'Success' });
  });
});

// Delete a property (Admin only)
router.delete("/:id", verifyToken, adminOnly, (req, res) => {
  db.query('DELETE FROM properties WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.json({ Status: 'Error', Error: err.message });
    res.json({ Status: 'Success' });
  });
});

export { router as properties };
