import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mainRoutes from "./routes/mainRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173" || "https://e-commerce-git-main-aashish11.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("API is running.....");
});

app.use("/api", mainRoutes);

app.use(errorMiddleware);

export default app;
