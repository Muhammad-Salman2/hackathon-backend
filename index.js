import express from "express";
import mongoose from "./connections/DBconnection.js";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./Routes/user.js";

dotenv.config(); // Load .env file


const app = express();
const port = 5000;

// for mongo db connection
mongoose.connection.on("error", (err) => {
  console.log("Error in connection", err);
});

mongoose.connection.on("open", () => {
  console.log("MongoDB is connected successfully");
});

// main page message
app.get("/", (req, res) => {
  res.send("SMIT Hackathon Batch-11");
});

// app routes
app.use(cors())
app.use(express.json());
app.use("/user", userRoute);

app.listen(port, () => {
  console.log("Server is running on port:", port);
});
