import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AgentRequest, AgentResponse } from "./types";
import { Request, Response } from "express";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

app.post("/api/agent", async (req: Request<AgentRequest>, res: Response<AgentResponse>) => {
  try {
    const { prompt } = req.body;
    console.log(`Processing request with prompt: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log(`Response generated (${responseText.length} characters)`);
    res.json({ text: responseText });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).send("Agent error");
  }
});

app.listen(3002, () => {
  console.log("Agent backend running on http://localhost:3002");
  console.log("Listening for requests...");
});
