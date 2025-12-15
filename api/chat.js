export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationContext } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY missing');
      return res.status(500).json({ error: 'Server misconfigured: missing API key' });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a friendly English conversation partner helping someone practice English. Keep your responses conversational, natural, and engaging. Ask follow-up questions to keep the conversation going. Respond in 2-4 sentences, not too short but not too long. Be encouraging and help them feel comfortable speaking English. Never mention that you are an AI or that you are helping them practice.`
    };

    const messages = [systemPrompt, ...(conversationContext || []).slice(-10), { role: 'user', content: message }];

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages, max_tokens: 150, temperature: 0.8 })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Groq API error:', txt);
      return res.status(502).json({ error: 'Error from AI service' });
    }

    const data = await resp.json();
    const aiResponse = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'Sorry, I could not generate a response.';
    return res.status(200).json({ response: aiResponse, raw: data });

  } catch (err) {
    console.error('Server error (chat):', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
