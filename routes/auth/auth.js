import express from "express";
import db from "../utils/db.js";
import Jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) return res.json({ Status: 'Error', Error: err });
  
      if (results.length > 0) {
        if (password === results[0].password) {
          const token = Jwt.sign(
            { role: results[0].role, userID:results[0].userID },
            "jwt_secret_key",
            { expiresIn: "1h" }
          );
  
          // Set the cookie with proper options
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict", // Adjust if needed depending on your use case (e.g., "Lax" or "None")
          });
  
          return res.json({ Status: 'Success', role: results[0].role, userID:results[0].userID });
        } else {
          return res.json({ Status: 'Error', Error: 'Invalid credentials' });
        }
      } else {
        return res.json({ Status: 'Error', Error: 'Invalid credentials' });
      }
    });
  });


  router.post("/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict", 
    });
    
    return res.json({ Status: "Success", Message: "Logged out successfully" });
  });
  
  
  export { router as auth };
