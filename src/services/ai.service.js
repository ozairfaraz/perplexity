import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "Gemini",
  apiKey: process.env.GEMINI_API_KEY,
});