import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields (name, email, message)' }, { status: 400 });
    }

    // Basic sanitization / length limits
    const safeName = String(name).slice(0, 300);
    const safeEmail = String(email).slice(0, 300);
    const safePhone = String(phone || '').slice(0, 100);
    const safeMessage = String(message).slice(0, 5000);

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.error('Missing SMTP configuration in environment variables');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
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
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
