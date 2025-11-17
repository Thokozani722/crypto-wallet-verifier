const express = require('express');
const config = require('../config');
const {
  createUser,
  authenticateUser,
  issueToken,
  toPublicUser,
  createMagicLink,
  verifyMagicLink,
  upsertOAuthUser,
} = require('../services/authService');
const { sendMagicLinkEmail } = require('../services/notificationService');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await createUser({ name, email, password, plan });
    const token = issueToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await authenticateUser(email, password);
    const token = issueToken(user);
    return res.json({ user, token });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

router.post('/passwordless', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const link = createMagicLink(email);
    const magicUrl = `${config.clientUrl}/auth?token=${link.token}`;
    await sendMagicLinkEmail({ email, link: magicUrl });
    return res.json({ message: 'Magic link sent', expiresAt: link.expiresAt });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/passwordless/verify', (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }
    const user = verifyMagicLink(token);
    const jwtToken = issueToken(user);
    return res.json({ user, token: jwtToken });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/oauth/google', (req, res) => {
  try {
    const { token: googleToken, email, name } = req.body;
    if (!googleToken || !email) {
      return res.status(400).json({ message: 'Google token and email required' });
    }
    // In a real integration, verify googleToken via Google API.
    const user = upsertOAuthUser({ email, name, plan: 'pro' });
    const jwtToken = issueToken(user);
    return res.json({ user, token: jwtToken });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get('/me', authenticate, (req, res) => {
  return res.json({ user: toPublicUser(req.user) });
});

module.exports = router;
