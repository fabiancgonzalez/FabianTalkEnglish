const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// API Key de Groq (protegida en el servidor)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Función para manejar chat con IA
async function handleChat(req, res) {
    try {
        const { message, conversationContext } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('handleChat received', { message, conversationContextLength: (conversationContext || []).length });

        if (!GROQ_API_KEY) {
            console.warn('GROQ_API_KEY missing from environment');
            return res.status(500).json({ error: 'Server misconfigured: missing API key' });
        }

        const messages = [
            {
                role: 'system',
                content: `You are a friendly English conversation partner helping someone practice English. 
                Keep your responses conversational, natural, and engaging. 
                Ask follow-up questions to keep the conversation going. 
                Respond in 2-4 sentences, not too short but not too long.
                Be encouraging and help them feel comfortable speaking English.
                Never mention that you are an AI or that you are helping them practice.`
            },
            ...(conversationContext || []).slice(-10),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: messages,
                max_tokens: 150,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', errorText);
            return res.status(500).json({ error: 'Error from AI service' });
        }

        const data = await response.json();
        console.log('Groq response head:', JSON.stringify(data?.choices?.[0]?.message || data).slice(0, 500));
        const aiResponse = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'Sorry, I could not generate a response.';
        res.json({ response: aiResponse, raw: data });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Función para manejar traducción
async function handleTranslate(req, res) {
    try {
        const { text, from = 'en', to = 'es' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
        );

        if (!response.ok) {
            throw new Error('Translation API error');
        }

        const data = await response.json();
        console.log('Translation API response:', data.responseData);
        const translated = data.responseData?.translatedText || text;
        res.json({ translation: translated, raw: data });

    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
}

// Rutas API (sin prefijo y con prefijo para WNPower)
app.post('/api/chat', handleChat);
app.post('/api/translate', handleTranslate);
app.post('/fabiantalkenglish/api/chat', handleChat);
app.post('/fabiantalkenglish/api/translate', handleTranslate);

// Health check
app.get('/api/ping', (req, res) => {
    res.json({ ok: true, groq_key_present: !!GROQ_API_KEY });
});

// Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/fabiantalkenglish', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/fabiantalkenglish/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});
