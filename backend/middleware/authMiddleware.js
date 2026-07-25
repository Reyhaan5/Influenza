import jwt from "jsonwebtoken";
import User from "../models/User.js";

// "Middleware" is a function that runs BEFORE your route handler,
// and can either let the request continue (next()) or stop it (res.status...).
// This one checks: did the request include a valid login token?
export const protect = async (req, res, next) => {
  let token;

  // The frontend sends the token like: Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      // jwt.verify checks the signature and expiry. If it's been tampered
      // with, or expired, this throws an error and we land in catch{}.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user to the request so every route after
      // this one can just read req.user — no need to look it up again.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists." });
      }

      return next(); // all good — continue to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token." });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided." });
};

// Optional extra layer: restricts a route to specific roles.
// Usage: router.get("/brand-only", protect, requireRole("brand"), handler)
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for your role." });
    }
    next();
  };
};
