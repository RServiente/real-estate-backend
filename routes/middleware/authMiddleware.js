import Jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token provided. Unauthorized access attempt.");
    return res.status(401).json({ Status: "Error", Error: "Unauthorized" });
  }

  Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ Status: "Error", Error: "Forbidden" });
    }

    console.log("Decoded JWT:", decoded);

    req.user = {
      userID: decoded.userID, // Ensure this matches the JWT payload field name
      role: decoded.role,
    };

    console.log("User ID from token:", req.user.userID);
    console.log("User role from token:", req.user.role);

    next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    console.log(`Access denied for user ID ${req.user.userID} with role ${req.user.role}`);
    return res.status(403).json({ Status: "Error", Error: "Admin access only" });
  }
  
  console.log(`Admin access granted for user ID ${req.user.userID}`);
  next();
};

export { verifyToken, adminOnly };
