const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const config = require('../config');
const { users, magicLinks } = require('../data/mockData');

const normalizePlan = (plan = 'free') => plan.toLowerCase();

const toPublicUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const issueToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

const findUserByEmail = (email) => users.find((user) => user.email === email.toLowerCase());

const createUser = async ({ name, email, password, plan = 'free' }) => {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
  const normalizedPlan = normalizePlan(plan);

  const user = {
    id: uuid(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    plan: normalizedPlan,
    role: normalizedPlan,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return toPublicUser(user);
};

const authenticateUser = async (email, password) => {
  const user = findUserByEmail(email);
  if (!user || !user.passwordHash) {
    throw new Error('Invalid credentials');
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new Error('Invalid credentials');
  }
  return toPublicUser(user);
};

const createMagicLink = (email) => {
  const normalizedEmail = email.toLowerCase();
  let user = findUserByEmail(normalizedEmail);

  if (!user) {
    user = {
      id: uuid(),
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      plan: 'free',
      role: 'free',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  const token = uuid();
  const expiresAt = Date.now() + config.magicLinkTtl;

  magicLinks.push({
    token,
    userId: user.id,
    email: normalizedEmail,
    expiresAt,
  });

  return { token, expiresAt, user: toPublicUser(user) };
};

const verifyMagicLink = (token) => {
  const record = magicLinks.find((entry) => entry.token === token);
  if (!record) {
    throw new Error('Invalid or expired token');
  }

  if (Date.now() > record.expiresAt) {
    throw new Error('Magic link expired');
  }

  const user = users.find((u) => u.id === record.userId);
  if (!user) {
    throw new Error('User not found for magic link');
  }

  // consume link
  const index = magicLinks.indexOf(record);
  magicLinks.splice(index, 1);

  return toPublicUser(user);
};

const upsertOAuthUser = ({ email, name, plan = 'pro' }) => {
  const normalizedEmail = email.toLowerCase();
  let user = findUserByEmail(normalizedEmail);

  if (!user) {
    user = {
      id: uuid(),
      name,
      email: normalizedEmail,
      plan: normalizePlan(plan),
      role: normalizePlan(plan),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
  }

  return toPublicUser(user);
};

module.exports = {
  createUser,
  authenticateUser,
  issueToken,
  toPublicUser,
  createMagicLink,
  verifyMagicLink,
  upsertOAuthUser,
};
