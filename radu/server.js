const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if(!OPENAI_KEY){
  console.warn('Warning: OPENAI_API_KEY not set. The /api/hints endpoint will fail until you set it.');
}

app.post('/api/hints', async (req, res) => {
  const { text } = req.body || {};
  if(!text) return res.status(400).json({error:'Missing text in body.'});
  if(!OPENAI_KEY) return res.status(500).json({error:'Server missing OPENAI_API_KEY env var.'});

  try{
    const system = `You are a helpful tutor assistant that gives brief study hints and suggestions for homework problems. Do NOT provide full solutions or step-by-step answers. Give up to 6 short high-level hints, focusing on concepts, checks, strategies, and possible next steps the student can try.`;
    const user = `Problem or text:\n\n${text}\n\nProvide up to 6 short hints as JSON array of strings. No solutions.`;

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 400,
      temperature: 0.6
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(body)
    });

    if(!r.ok){
      const txt = await r.text();
      console.error('OpenAI error', r.status, txt);
      return res.status(502).json({error:'OpenAI API error', detail:txt});
    }

    const data = await r.json();
    const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';

    let hints = [];
    try{
      const cleaned = content.replace(/```(?:json)?\n?|```/g,'').trim();
      const parsed = JSON.parse(cleaned);
      if(Array.isArray(parsed)) hints = parsed.map(String);
    }catch(e){
      hints = content.split(/\n+/).map(s=>s.replace(/^\s*[-•\d\.]+\s*/,'').trim()).filter(Boolean).slice(0,6);
    }

    res.json({hints});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Internal server error'});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`OpenAI hint proxy listening on http://localhost:${port}`));
