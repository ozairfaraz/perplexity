import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";

export async function sendMessage(req, res) {
  const { message, chatId } = req.body;

  if (!chatId) {
    const title = await generateChatTitle(message);
    const chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  res.status(200).json({
    messages,
  });
}

export async function getChats(req, res) {
  const chats = await chatModel.find({ user: req.user.id });

  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chats = await chatModel.find({ _id: chatId, user: req.user.id });

  if (!chats) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({
    message: "Messages retrieved successfully",
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chats = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  const messages = await messageModel.deleteMany({ chat: chatId });

  if (!chats) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  res.status(200).json({
    message: "Chat deleted successfully",
  });
}
