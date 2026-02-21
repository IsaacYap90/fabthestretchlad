// In-memory rate limiter (per Vercel serverless instance)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per IP per window
const MAX_MESSAGES = 20; // max conversation length
const MAX_MESSAGE_LENGTH = 500; // max characters per message

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages required' });

  // Input validation
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: 'Conversation too long. Please start a new chat.' });
  }

  const sanitized = messages
    .filter(m => m && typeof m.role === 'string' && typeof m.content === 'string')
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (sanitized.length === 0) return res.status(400).json({ error: 'No valid messages' });

  const systemPrompt = `You are Fab's AI assistant for Fab The Stretch Lad, a professional sports stretch therapy service in Singapore.

About Fab:
- Professional stretch therapist specializing in sports stretch therapy
- Located in Singapore
- Instagram: @fab.thestretchlad
- Services: 1-on-1 stretch sessions (30min, 60min, 90min)
- Pricing: 30min $50, 60min $80, 90min $110
- Specialties: Sports recovery, desk worker relief, flexibility improvement, injury prevention
- Available: Monday to Saturday, 8am-8pm

Your job:
- Answer questions about stretch therapy, pricing, availability
- Assess client needs: ask about their pain points, lifestyle, activity level
- Recommend the right session length based on their needs
- Guide them to book via the contact form or WhatsApp
- Be friendly, professional, encouraging
- Keep responses to 2-3 sentences max
- Never give medical advice — recommend seeing a doctor for injuries
- Sign off as "Fab's AI Assistant"
- If asked about anything unrelated, politely redirect to stretch therapy

Common recommendations:
- Desk workers with tight shoulders/neck → 60min session
- Athletes needing recovery → 90min session
- First-timers just trying it out → 30min session
- Chronic back pain → 60min session, recommend consistency (weekly)`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...sanitized],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'API error' });

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch {
    return res.status(500).json({ error: 'Failed to reach AI service' });
  }
}
