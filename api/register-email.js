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
    return res.status(200).json({ status: 'ok', message: 'PulseIQ Registration Mail Service' });
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
    const {
      name = 'Growth Leader',
      email = 'sheth.jainam.coder@gmail.com',
      company = 'PulseIQ Intelligence',
      adSpend = '$50,000 – $150,000 / month',
      role = 'Growth Lead',
    } = body || {};

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const userWelcomeHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background-color: #0b1326; color: #dae2fd; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #131b2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px;">
        <h2 style="color: #60a5fa; margin-top: 0;">Welcome to PulseIQ, ${name}!</h2>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
          Your workspace access for <strong>${company}</strong> has been configured.
        </p>
        <div style="background: #0b1326; padding: 14px; border-radius: 10px; margin: 16px 0; font-size: 13px;">
          <p style="margin: 4px 0;"><strong>Work Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Ad Spend Scope:</strong> ${adSpend}</p>
          <p style="margin: 4px 0;"><strong>Admin Email:</strong> ${ADMIN_EMAIL}</p>
        </div>
        <a href="https://pluse-iq-marketing.vercel.app" style="display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 20px; border-radius: 8px; margin-top: 10px;">Open Live Dashboard →</a>
        <p style="font-size: 11px; color: #64748b; margin-top: 20px;">Timestamp: ${timestamp} (IST)</p>
      </div>
    </body>
    </html>`;

    const adminAlertHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 20px;">
      <div style="max-width: 580px; margin: auto; background: #1e293b; border-radius: 16px; padding: 20px;">
        <h3 style="color: #38bdf8; margin-top: 0;">🚨 New PulseIQ User Registered</h3>
        <p style="font-size: 13px; color: #94a3b8;">User Name: <strong>${name}</strong><br>Email: <strong>${email}</strong><br>Company: <strong>${company}</strong><br>Ad Spend: <strong>${adSpend}</strong><br>Registered: ${timestamp}</p>
      </div>
    </body>
    </html>`;

    const transporter = getTransporter();

    const [userRes, adminRes] = await Promise.allSettled([
      transporter.sendMail({
        from: `"PulseIQ Intelligence" <${ADMIN_EMAIL}>`,
        to: email,
        bcc: ADMIN_EMAIL,
        subject: `🎉 Welcome to PulseIQ Marketing Intelligence (${name})`,
        html: userWelcomeHtml,
      }),
      transporter.sendMail({
        from: `"PulseIQ Alerts" <${ADMIN_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `🔔 [PulseIQ Alert] New User: ${name} (${email})`,
        html: adminAlertHtml,
      }),
    ]);

    return res.status(200).json({
      success: true,
      userDelivery: userRes.status === 'fulfilled' ? 'delivered' : 'queued',
      adminDelivery: adminRes.status === 'fulfilled' ? 'delivered' : 'queued',
      notifiedAdmin: ADMIN_EMAIL,
    });
  } catch (err) {
    console.error('Registration API error:', err);
    return res.status(200).json({
      success: false,
      error: err.message || 'Internal processing error',
    });
  }
}
