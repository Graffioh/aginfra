import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "google-flash-lite-latest" });

app.post("/api/agent", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);

    res.json({ text: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Agent error");
  }
});

app.listen(3001, () => console.log("Agent backend running on 3001"));
