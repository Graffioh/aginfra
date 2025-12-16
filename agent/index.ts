import express from "express";
import cors from "cors";
import { AgentRequest, AgentResponse } from "./types";
import { Request, Response } from "express";
import { runLoop } from "./loop";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json());

const SYSTEM_PROMPT = `
You are a helpful assistant that can answer questions and help with tasks.
Your response should be concise and to the point.

You have access to tools to help you with your tasks (if needed).
`.trim();

app.post("/api/agent", async (req: Request<AgentRequest>, res: Response<AgentResponse>) => {
  try {
    const { prompt } = req.body;

    const assistantText = await runLoop(prompt, SYSTEM_PROMPT);
    res.json({ text: assistantText });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).send("Agent error");
  }
});

app.listen(3002, () => {
  console.log("Agent backend running on http://localhost:3002");
  console.log("Listening for requests...");
});
