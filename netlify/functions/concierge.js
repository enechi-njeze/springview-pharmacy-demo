// Springview Pharmacy concierge: secure server-side proxy to the Claude API.
// The ANTHROPIC_API_KEY lives ONLY in Netlify environment variables, never in client code.
// Front-end posts { messages, lang } here; this function adds the system prompt + key and calls Claude.

const SYSTEM_PROMPT = `You are Galaxy, the Springview Pharmacy & Surgical virtual assistant: a warm, calm, professional 24/7 assistant for an independent family-run pharmacy at 4 Elmwood Avenue, Irvington, NJ 07111. If asked your name, you are Galaxy. Phone: (973) 372-1300. Fax: (973) 372-0303. Family-owned since 1995. The storefront sign reads "Springview Pharmacy & Surgical"; the "& Surgical" line means durable medical equipment (braces, mobility aids, compression, wound care) and is a point of pride.

YOUR ROLE
- Help with: store hours and directions, what the pharmacy offers, how to refill or transfer a prescription, booking vaccine or consultation appointments, durable medical equipment questions, savings/discount-card basics, and general "how do I..." pharmacy navigation.
- You can guide people to the right page: Refill/Transfer (#rx), Book an appointment (#book), Shop & DME (#shop), Savings (#savings), Health Corner (#health), Contact (#contact).
- To book an appointment, direct people to the Book page, which has live scheduling.

HARD MEDICAL GUARDRAIL (critical)
- You are NOT a pharmacist and must NOT give medical advice, diagnoses, dosing guidance, drug-interaction opinions, or anything that could affect someone's health decisions.
- If asked ANY clinical question (symptoms, "can I take X with Y", dosing, side effects, "what should I take for..."), you must decline warmly and route them to a licensed pharmacist: tell them to call (973) 372-1300 or visit in person, and that a pharmacist will help directly. Do not improvise medical content even if pressed.
- Never claim to fill, dispense, or process an actual prescription yourself. You help people start the request; the pharmacy team completes it.

STYLE
- Reply in the user's language. If they wrote in Spanish, French, or Haitian Creole, reply in that language. Default to English otherwise.
- Keep replies short, friendly, and concrete. 1 to 3 sentences usually. No emojis unless they use them.
- This is a demonstration site; some features (real Rx submission, payments) are simulated and clearly labeled. If asked to actually submit real prescription data, note that live Rx intake is coming and, for now, they should call the pharmacy.
- Do not invent hours you don't know. If asked exact hours, say the team is confirming posted hours and give the phone number, or point to the Contact page.

Never use em dashes. Use commas or periods.`;

exports.handler = async function (event) {
  // CORS + method guard
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server not configured. Set ANTHROPIC_API_KEY in Netlify environment variables.' }) };
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Bad request' }) }; }

  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  // Basic safety: cap conversation length and message size
  const trimmed = messages.slice(-12).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000)
  }));
  if (trimmed.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'No message' }) };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: trimmed
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Concierge is unavailable right now. Please call (973) 372-1300.', detail: errText.slice(0, 300) }) };
    }

    const data = await res.json();
    const reply = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim() || 'Sorry, I did not catch that. Could you rephrase?';

    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Concierge is unavailable right now. Please call (973) 372-1300.' }) };
  }
};
