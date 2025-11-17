const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

const demoUserId = uuid();

const users = [
  {
    id: demoUserId,
    name: 'Demo Security Lead',
    email: 'demo@cryptoguard.dev',
    passwordHash: bcrypt.hashSync('password123', 10),
    plan: 'pro',
    role: 'pro',
    createdAt: new Date().toISOString(),
  },
];

const wallets = [
  {
    id: uuid(),
    userId: demoUserId,
    label: 'Operations ETH',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    blockchain: 'ETH',
    balance: 4.52,
    currency: 'ETH',
    tags: ['treasury', 'ops'],
    lastSync: new Date().toISOString(),
  },
  {
    id: uuid(),
    userId: demoUserId,
    label: 'BTC Cold Storage',
    address: 'bc1qw508d6qejxtdg4y5r3zarvaryv98gj9p9s3ju6',
    blockchain: 'BTC',
    balance: 1.8372,
    currency: 'BTC',
    tags: ['cold-storage'],
    lastSync: new Date().toISOString(),
  },
];

const transactions = [
  {
    id: uuid(),
    walletId: wallets[0].id,
    blockchain: 'ETH',
    hash: '0x9c30dcb3c2a840f8',
    direction: 'outgoing',
    counterparty: '0x92d8f10248c6a3953cc3692a894655ad05d61efb',
    amount: 1.24,
    currency: 'ETH',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'confirmed',
    risk: 'low',
  },
  {
    id: uuid(),
    walletId: wallets[0].id,
    blockchain: 'ETH',
    hash: '0x71bd898722c383f6',
    direction: 'incoming',
    counterparty: '0x9c9c332885d53bc3',
    amount: 0.92,
    currency: 'ETH',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'confirmed',
    risk: 'medium',
  },
  {
    id: uuid(),
    walletId: wallets[1].id,
    blockchain: 'BTC',
    hash: '19h6881bc9221',
    direction: 'outgoing',
    counterparty: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: 0.52,
    currency: 'BTC',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'confirmed',
    risk: 'high',
  },
];

const alerts = [
  {
    id: uuid(),
    walletId: wallets[1].id,
    severity: 'high',
    type: 'large_transfer',
    description: 'Outgoing transfer exceeded threshold for BTC cold storage.',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: uuid(),
    walletId: wallets[0].id,
    severity: 'medium',
    type: 'new_counterparty',
    description: 'Interaction with previously unseen ETH address.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

const magicLinks = [];

module.exports = {
  users,
  wallets,
  transactions,
  alerts,
  magicLinks,
};
