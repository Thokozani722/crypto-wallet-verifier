const { v4: uuid } = require('uuid');
const { wallets, transactions } = require('../data/mockData');

const SUPPORTED_CHAINS = ['BTC', 'ETH', 'SOL'];

const USD_RATES = {
  BTC: 65000,
  ETH: 3200,
  SOL: 150,
};

const generateMockTransactions = (walletId, blockchain, currency) => {
  const newestTx = {
    id: uuid(),
    walletId,
    blockchain,
    hash: uuid().replace(/-/g, '').slice(0, 16),
    direction: Math.random() > 0.5 ? 'incoming' : 'outgoing',
    counterparty: Math.random().toString(36).slice(2, 12),
    amount: Number((Math.random() * 1.5).toFixed(4)),
    currency,
    timestamp: new Date().toISOString(),
    status: 'pending',
    risk: 'low',
  };
  transactions.unshift(newestTx);
  return newestTx;
};

const getWalletBalances = (userId) =>
  wallets
    .filter((wallet) => wallet.userId === userId)
    .map((wallet) => {
      const rate = USD_RATES[wallet.blockchain] ?? 1;
      const drift = Number((Math.random() * 0.05).toFixed(4));
      const balance = Number((wallet.balance + drift).toFixed(4));
      const usdValue = Number((balance * rate).toFixed(2));
      return {
        ...wallet,
        balance,
        usdValue,
        healthScore: Math.min(100, Math.round(70 + Math.random() * 30)),
      };
    });

const getWalletTransactions = (walletId, limit = 25) => {
  const wallet = wallets.find((w) => w.id === walletId);
  if (!wallet) return [];

  // Periodically enrich with mock tx so dashboard looks alive
  if (Math.random() > 0.7) {
    generateMockTransactions(walletId, wallet.blockchain, wallet.currency);
  }

  return transactions
    .filter((tx) => tx.walletId === walletId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

const upsertWallet = ({ userId, address, blockchain, label }) => {
  const normalized = blockchain.toUpperCase();
  if (!SUPPORTED_CHAINS.includes(normalized)) {
    throw new Error(`Blockchain ${blockchain} is not supported yet.`);
  }

  const newWallet = {
    id: uuid(),
    userId,
    label,
    address,
    blockchain: normalized,
    currency: normalized,
    balance: Number((Math.random() * 5).toFixed(4)),
    tags: [],
    lastSync: new Date().toISOString(),
  };

  wallets.push(newWallet);
  return newWallet;
};

const removeWallet = (walletId, userId) => {
  const idx = wallets.findIndex((wallet) => wallet.id === walletId && wallet.userId === userId);
  if (idx === -1) {
    throw new Error('Wallet not found');
  }
  wallets.splice(idx, 1);
};

module.exports = {
  SUPPORTED_CHAINS,
  getWalletBalances,
  getWalletTransactions,
  upsertWallet,
  removeWallet,
};
