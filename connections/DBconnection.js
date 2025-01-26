//connection/dbconnection.js

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load .env file

// Destructure the environment variables
const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// console.log(DB_USER, DB_PASSWORD, DB_NAME);
// console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);

const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@smit.9zo1a.mongodb.net/${DB_NAME}`;
mongoose.connect(url);
export default mongoose;
