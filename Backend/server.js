import dotenv from "dotenv";
dotenv.config();

import express from "express";
import ConnectDB from "./config/db.js";

ConnectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("API is running.....");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});
