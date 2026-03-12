import express from "express";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Perplexity API",
  });
});

// Routes
app.use("/api/auth", AuthRouter);

export default app;
