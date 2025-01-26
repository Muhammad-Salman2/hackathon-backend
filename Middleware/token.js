import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load .env file

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extracting token from header

  if (!token) {
    // If token is not found
    return res.status(401).json({ message: "Token not found" }); // Return immediately to stop further processing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      // console.log(decoded);

      req.user = decoded; // Attach the decoded user to the request object
      // console.log(req.user);

      next(); // If token is valid, move to the next middleware
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" }); // If token is invalid/expired
  }
};

export default verifyToken;
