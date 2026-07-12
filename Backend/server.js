import dotenv from "dotenv";
dotenv.config();

import express from "express";
import ConnectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import mainRoutes from "./routes/mainRoutes.js";
import cors from "cors";

ConnectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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
