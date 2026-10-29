// Vercel Node.js function. Secrets belong in Vercel environment variables.
const fields = ['name', 'email', 'website', 'q1', 'q2', 'q3', 'q4', 'q5'];
const titles = {
  name: 'Name', email: 'Email', website: 'Website',
  q1: 'Business and customers', q2: 'Time or money problems',
  q3: 'Customer difficulties', q4: 'Desired improvements', q5: 'Non-negotiables'
};
const limits = { name: 100, email: 254, website: 300, q1: 1500, q2: 1500, q3: 1500, q4: 1500, q5: 1500 };
const reply = (res, code, message) => res.status(code).json({ error: message });

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, 'Method not allowed.');
  }
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) return reply(res, 503, 'Enquiries are not open yet.');

  // Basic browser-origin safeguard. This is not a substitute for rate limiting.
  const origin = req.headers.origin;
  if (origin) {
    let host;
    try { host = new URL(origin).hostname.toLowerCase(); } catch { return reply(res, 403, 'Request not permitted.'); }
    if (!['aibusinessready.co', 'www.aibusinessready.co', 'aibusinessready-site.vercel.app'].includes(host)) {
      return reply(res, 403, 'Request not permitted.');
    }
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(res, 400, 'Invalid request.');
  if (typeof body.company_fax === 'string' && body.company_fax.trim()) {
    return res.status(200).json({ ok: true }); // Honeypot: silently discard bots.
  }
  const values = {};
  for (const field of fields) {
    const value = body[field];
    if (typeof value !== 'string' || value.length > limits[field]) return reply(res, 400, `Check ${titles[field]}.`);
    values[field] = value.trim();
    if (field !== 'website' && !values[field]) return reply(res, 400, `Please complete ${titles[field]}.`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || /[\r\n]/.test(values.email)) {
    return reply(res, 400, 'Enter a valid email address.');
  }
  if (values.website && !/^https?:\/\/\S+$/i.test(values.website)) {
    return reply(res, 400, 'Please use a complete website URL beginning with https://');
  }
  const text = [
    'New AI Business Ready enquiry (NOT a paid order)',
    '', ...fields.flatMap(k => [`${titles[k]}:`, values[k] || '(not supplied)', '']),
    'Reply to this enquiry only; no marketing list subscription was requested.'
  ].join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: values.email,
        subject: 'AI Business Ready — new enquiry', text })
    });
    if (!r.ok) {
      console.error('Resend rejected enquiry', r.status); // Never log personal data or provider response.
      return reply(res, 502, 'Message could not be delivered. Please try again later.');
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Resend connection error');
    return reply(res, 502, 'Message could not be delivered. Please try again later.');
  }
}
