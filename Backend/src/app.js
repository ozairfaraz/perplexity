import express from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth.routes.js";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Perplexity API",
  });
});

// Routes
app.use("/api/auth", AuthRouter);

export default app;
