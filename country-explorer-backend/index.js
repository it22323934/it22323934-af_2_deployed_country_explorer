import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Add this import
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

mongoose
  .connect(
    "mongodb+srv://asiri:asiri@zero-waste.e07fd.mongodb.net/?retryWrites=true&w=majority&appName=ZERO-WASTE"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection failed");
  });

const __dirname = path.resolve();

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: true, // Allow requests from any origin
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json());
app.use(cookieParser());
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use(express.static(path.join(__dirname, "/country-explorer/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "country-explorer", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export { app, server };
