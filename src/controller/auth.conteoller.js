import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

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

    await sendEmail({
      to: email,
      subject: "Welcome to Perplexity!",
      html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
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
