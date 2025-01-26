import express from "express";
import userModel from "../Models/userSchemaAndModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendResponse from "../helper/sendResponse.js";
import verifyToken from "../Middleware/token.js";
// import verifyToken from "../middlewares/tokenVerification.js";

const userRoute = express.Router();

// Create a new user
userRoute.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      sendResponse(res, 400, null, "Please provide all the details", true);
      return;
    }

    // Check if email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      sendResponse(res, 400, null, "Email already registered", null);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const user = await newUser.save();

    // Optionally generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    sendResponse(res, 201, { user, token }, null, "User created successfully");
  } catch (error) {
    sendResponse(res, 500, null, "Something went wrong", error.message);
  }
});

// Login user
userRoute.post("/signin", async (req, res) => {
  try {
    const { email: currentUserEmail, password: currentUserPassword } = req.body;

    // Validate input
    if (!currentUserEmail || !currentUserPassword) {
      sendResponse(
        res,
        400,
        null,
        "Both Email and password are required",
        true
      );
      return;
    }

    // Find the user in the database
    const user = await userModel.findOne({ email: currentUserEmail }).lean();
    if (!user) {
      sendResponse(res, 404, null, "User not found", null);
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      currentUserPassword,
      user.password
    );

    if (!isPasswordValid) {
      sendResponse(res, 401, null, "Invalid password", null);
      return;
    }

    // Generating token
    var token = jwt.sign(user, process.env.JWT_SECRET);
    // console.log(token);
    // sendResponse(res, 200, { user, token },  "User login successfully", null);
    sendResponse(res, 200, { user, token }, "User login successfully", null);
    return;
  } catch (error) {
    console.error("Error logging in user:", error);
    sendResponse(res, 500, null, "Error logging in user", error.message);
    return;
  }
});

// get all user data
userRoute.get("/allUsers", async (req, res) => {
  try {
    const allUserData = await userModel.find();
    sendResponse(res, 200, allUserData, "All users data", false);
    return;
  } catch (error) {
    console.error("Error getting users:", error);
    sendResponse(res, 500, null, "Error getting users", error.message);
    return;
  }
});

// get current user data
userRoute.get("/currentUserInfo", verifyToken, async (req, res) => {
    try {
      // Ensure req.user is set by verifyToken middleware
      if (!req.user || !req.user._id) {
        sendResponse(res, 401, null, "Unauthorized perrson", false);
        return;
      }
  
      // Find the user by ID
      const currentUser = await userModel.findById(req.user._id);
  
      // Handle case where user is not found
      if (!currentUser) {
        sendResponse(res, 404, null, "User not found", false);
        return;
      }
  
      // Respond with the current user's data
      sendResponse(res, 200, currentUser, "Current user data", false);
    } catch (error) {
      console.error("Error getting current user info:", error);
      sendResponse(res, 500, null, "Error getting user info", error.message);
    }
  });
  

export default userRoute;
