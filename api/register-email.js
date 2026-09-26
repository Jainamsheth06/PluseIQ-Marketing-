import { sendRegistrationNotification } from '../server/emailService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await sendRegistrationNotification(data);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Registration email error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
