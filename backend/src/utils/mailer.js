const nodemailer = require("nodemailer");
const logger = require("./logger");

let transporter = null;

const isConfigured = () => Boolean(process.env.SMTP_HOST);

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  return transporter;
};

const buildEmail = ({ username, code, expiresInMinutes }) => {
  const text = `Hi ${username},\n\nYour KeelCompass verification code is: ${code}\n\nThis code expires in ${expiresInMinutes} minutes. If you didn't request this, you can safely ignore this email.\n\n— KeelCompass`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h2 style="color: #0E8B87;">KeelCompass</h2>
      <p>Hi ${username},</p>
      <p>Use the code below to finish creating your KeelCompass account:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; background: #f0fdfa; color: #0E8B87; padding: 16px; border-radius: 8px; margin: 24px 0;">
        ${code}
      </div>
      <p>This code expires in ${expiresInMinutes} minutes.</p>
      <p style="color: #6b7280; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return { text, html };
};

const sendVerificationCodeEmail = async ({ to, username, code, expiresInMinutes }) => {
  const { text, html } = buildEmail({ username, code, expiresInMinutes });

  if (!isConfigured()) {
    logger.warn(
      `[DEV MODE] SMTP is not configured — not sending real email. Verification code for ${to}: ${code} (expires in ${expiresInMinutes} minutes)`
    );
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || '"KeelCompass" <no-reply@keelworks.org>',
    to,
    subject: "Your KeelCompass verification code",
    text,
    html,
  });
};

module.exports = { sendVerificationCodeEmail };
