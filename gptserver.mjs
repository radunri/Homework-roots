import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    // Call GPT
    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: `
Please respond ONLY in strict JSON format.
Include exactly two fields: "title" and "body".
Message: "${req.body.message}"
          `
        }
      ]
    });

    const raw = response.choices[0].message.content.trim();

    // Parse JSON safely
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { title: "Error", body: raw };
    }

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ title: "Error", body: "Could not connect to GPT-5." });
  }
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
