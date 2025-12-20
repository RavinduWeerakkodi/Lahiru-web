import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields (name, email, message)' });
  }

  // Basic sanitization / length limits
  const safeName = String(name).slice(0, 300);
  const safeEmail = String(email).slice(0, 300);
  const safePhone = String(phone || '').slice(0, 100);
  const safeMessage = String(message).slice(0, 5000);

  // Configure transporter from env vars
  // Required env vars:
  // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  // Optional: SMTP_SECURE (set to 'true' for secure), SMTP_FROM (from address), TO_EMAILS (comma-separated list)
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error('Missing SMTP configuration in environment variables');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  const fromAddress = process.env.SMTP_FROM || user;
  const toEmails = process.env.TO_EMAILS || 'lahiruenterprice@gmail.com,ravinduweerakkodi.rw@gmail.com';

  const mailOptions = {
    from: `"Website Contact" <${fromAddress}>`,
    to: toEmails,
    subject: `New contact form message from ${safeName}`,
    text: `Name: ${safeName}\nEmail: ${safeEmail}\nPhone: ${safePhone}\n\nMessage:\n${safeMessage}`,
    html: `
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;border-left:4px solid #eee;padding-left:10px">${safeMessage}</div>
      <hr/>
      <p>Sent from website contact form</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
