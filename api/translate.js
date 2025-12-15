export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, from = 'en', to = 'es' } = req.body || {};
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const resp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    if (!resp.ok) {
      console.error('Translation API returned non-ok');
      return res.status(502).json({ error: 'Translation API error' });
    }

    const data = await resp.json();
    const translated = data.responseData?.translatedText || text;
    return res.status(200).json({ translation: translated, raw: data });

  } catch (err) {
    console.error('Translation error:', err);
    return res.status(500).json({ error: 'Translation failed' });
  }
}
