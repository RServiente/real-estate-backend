import express from "express"; // Ensure express is imported
import cors from "cors"; // Ensure cors is imported
import { auth } from "./routes/auth/auth.js";
import { users } from "./routes/user/users.js";
import { properties } from "./routes/properties/properties.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", auth);
app.use("/users", users);
app.use("/properties", properties);
app.use(express.static("Public"));

app.get("/profile", (req, res) => {
  const token = req.cookies.token;
   //console.log('Received Token:', token); Log token for debugging

  if 
  (!token) {
    return res.status(401).json({ Status: "Error", Error: "Not authenticated" });
  }
  Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err){
      return res.status(403).json({ Status: "Error", Error: "Invalid token" });
    } 

    return res.json({ Status: "Success" , id: decoded.id, role: decoded.role, userID: decoded.userID });
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
