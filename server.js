// Minimal Express proxy to call OpenAI's Chat Completions API for hint generation.
// Usage: set OPENAI_API_KEY in the environment, then `node server.js`.
// This proxy is intentionally minimal: it accepts POST /api/hints { text }
// and returns { hints: [..] } where hints are short non-solution hints.

const express = require('express');
const app = express();
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if(!OPENAI_KEY){
  console.warn('Warning: OPENAI_API_KEY not set. The /api/hints endpoint will fail until you set it.');
}

app.post('/chat', async (req, res) => {
  const { text } = req.body || {};
  if(!text) return res.status(400).json({error:'Missing text in body.'});
  if(!OPENAI_KEY) return res.status(500).json({error:'Server missing OPENAI_API_KEY env var.'});

  try{
    // Build prompt for hints only
    const user = `Problem or text:\n\n${text}\n\nProvide up to 6 short hints as JSON array of strings. No solutions.`;

    const body = {
      model: 'gpt-5-mini',
      messages: [
        { role: 'user', content: user }
      ],
      max_tokens: 400,
    };

    const raw = response.choices[0].message.content.trim();

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

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`OpenAI hint proxy listening on http://localhost:${port}`));
