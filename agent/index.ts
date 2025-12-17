import "dotenv/config";
import express from "express";
import cors from "cors";
import { AgentRequest, AgentResponse } from "./types";
import { Request, Response } from "express";
import { runLoop } from "./loop";
import { clearInspectionClient, setInspectionClient, clearContextClient, setContextClient } from "./sse-client";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.post("/api/agent", async (req: Request<AgentRequest>, res: Response<AgentResponse>) => {
  try {
    const { prompt } = req.body;

    const assistantText = await runLoop(prompt);
    res.json({ text: assistantText });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).send("Agent error");
  }
});

app.get("/api/agent/events/inspection", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  setInspectionClient(res);

  res.write("data: Connected to Agent Inspection Channel!\n\n");

  req.on("close", () => {
    clearInspectionClient();
    res.end();
    console.log("Inspection SSE Client disconnected");
  });
});

app.get("/api/agent/events/context", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  setContextClient(res);

  res.write("data: []\n\n");

  req.on("close", () => {
    clearContextClient();
    res.end();
    console.log("Context SSE Client disconnected");
  });
});

app.listen(3002, () => {
  console.log("Agent backend running on http://localhost:3002");
  console.log("Listening for requests...");
});
