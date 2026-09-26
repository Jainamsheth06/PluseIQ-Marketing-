import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.SMTP_USER || 'sheth.jainam.coder@gmail.com';
const ADMIN_PASS = process.env.SMTP_PASS || 'piavlgmkshthjxkb';

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: ADMIN_EMAIL,
      pass: ADMIN_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', message: 'PulseIQ Password Reset OTP Service' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { email, otp, name = 'PulseIQ User' } = body || {};

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const resetHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #0b1326; color: #dae2fd; padding: 20px;">
      <div style="max-width: 580px; margin: auto; background: #131b2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px;">
        <h2 style="color: #60a5fa; margin-top: 0;">Password Reset OTP</h2>
        <p style="color: #94a3b8; font-size: 14px;">Hello <strong>${name}</strong>, use the one-time code below to reset your password:</p>
        <div style="background: #0b1326; border: 2px dashed #818cf8; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #38bdf8;">${otp}</span>
          <div style="font-size: 11px; color: #f59e0b; margin-top: 6px;">Valid for 10 minutes</div>
        </div>
        <p style="font-size: 11px; color: #64748b;">Dispatched by PulseIQ Security Gateway • Admin: ${ADMIN_EMAIL} • ${timestamp}</p>
      </div>
    </body>
    </html>`;

    const transporter = getTransporter();

    const [userRes, adminRes] = await Promise.allSettled([
      transporter.sendMail({
        from: `"PulseIQ Security" <${ADMIN_EMAIL}>`,
        to: email,
        bcc: ADMIN_EMAIL,
        subject: `🔐 PulseIQ Password Reset OTP: ${otp}`,
        html: resetHtml,
      }),
      transporter.sendMail({
        from: `"PulseIQ Security Alerts" <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `🔔 [PulseIQ Alert] Password Reset OTP Requested for: ${email}`,
        html: `<p>A password reset OTP (${otp}) was requested for <strong>${email}</strong> at ${timestamp}.</p>`,
      }),
    ]);

    return res.status(200).json({
      success: true,
      delivered: userRes.status === 'fulfilled',
      notifiedAdmin: ADMIN_EMAIL,
    });
  } catch (err) {
    console.error('Password reset OTP error:', err);
    return res.status(200).json({
      success: false,
      error: err.message || 'OTP dispatch failed',
    });
  }
}
