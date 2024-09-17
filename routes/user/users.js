import express from "express";
import Jwt from "jsonwebtoken";
import db from "../utils/db.js";
import { adminOnly, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, adminOnly, (req, res) => {
  db.query('SELECT userID, username, role FROM users', (err, results) => {
    if (err) return res.json({ Status: 'Error', Error: err });
    res.json({ Status: 'Success', users: results });
  });
});

router.post("/", verifyToken, adminOnly, (req, res) => {
  const { username, password, role } = req.body;
  const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.query(query, [username, password, role], (err) => {
    if (err) return res.json({ Status: 'Error', Error: err });
    res.json({ Status: 'Success' });
  });
});

export { router as users };