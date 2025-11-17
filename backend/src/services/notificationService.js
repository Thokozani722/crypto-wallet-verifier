const nodemailer = require('nodemailer');
const axios = require('axios');
const config = require('../config');

const transporter =
  config.email.user && config.email.pass
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      })
    : nodemailer.createTransport({
        jsonTransport: true,
      });

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  });
};

const triggerWebhook = async (payload) => {
  if (!config.webhookUrl) return;
  await axios.post(config.webhookUrl, payload).catch((err) => {
    console.error('Webhook error', err.message);
  });
};

const sendAlertNotification = async (user, alert) => {
  const subject = `[CryptoGuard] ${alert.severity.toUpperCase()} alert for wallet`;
  const html = `
    <h3>Suspicious activity detected</h3>
    <p>${alert.detail}</p>
    ${
      alert.tx
        ? `<p>Amount: <strong>${alert.tx.amount} ${alert.tx.currency}</strong> | Counterparty: ${alert.tx.counterparty}</p>`
        : ''
    }
    <p>Sign in to review: ${config.clientUrl}/dashboard</p>
  `;
  await sendEmail({ to: user.email, subject, html });
  await triggerWebhook({ userId: user.id, alert });
};

const sendMagicLinkEmail = async ({ email, link }) => {
  await sendEmail({
    to: email,
    subject: 'Your CryptoGuard secure login link',
    html: `<p>Click to sign in securely:</p><p><a href="${link}">${link}</a></p>`,
  });
};

module.exports = {
  sendAlertNotification,
  sendMagicLinkEmail,
  triggerWebhook,
};
