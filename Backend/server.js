import mainRoutes from "./routes/mainRoutes.js";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"; // ← add this
import ConnectDB from "./config/db.js";
import cookieParser from "cookie-parser";

ConnectDB();
const app = express();

app.use(
  cors({
    // ← add this before routes
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", mainRoutes);

app.get("/", (req, res) => {
  res.json("API is running.....");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});
