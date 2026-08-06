import dotenv from "dotenv";
dotenv.config();

import ConnectDB from "./config/db.js";
import app from "./app.js";

ConnectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});
