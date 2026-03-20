import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (isUserAlreadyExists)
      return res
        .status(400)
        .json({ message: "User with this email or username already exists" });

    const newUser = await userModel.create({ username, email, password });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await sendEmail({
      to: email,
      subject: "Welcome to Perplexity!",
      html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>To verify your email address and activate your account, please click the link below:</p>
                <p><a href="http://localhost:3000/api/auth/verify-email?token=${token}">Verify Email</a></p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.email) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    const htmlContent = `
      <h1>Hi ${user.username},</h1>
      <h1>Your email has been successfully verified! You can now log in to your account.</h1>
      <p><a href="http://localhost:3000/login">Log in to Perplexity</a></p>
      <p>Best regards,<br>The Perplexity Team</p>
    `;

    return res.send(htmlContent);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMe(req, res) {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
