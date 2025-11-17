const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { users, wallets, transactions } = require('../data/mockData');
const { getWalletTransactions } = require('../services/blockchainService');
const { generateReport } = require('../services/reportService');

const router = express.Router();

router.use(authenticate, authorize(['enterprise']));

router.get('/overview', (_req, res) => {
  const totalUsers = users.length;
  const totalWallets = wallets.length;
  const totalValue = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const highRiskTx = transactions.filter((tx) => tx.risk === 'high');
  return res.json({
    totalUsers,
    totalWallets,
    aggregatedBalance: Number(totalValue.toFixed(4)),
    highRiskCount: highRiskTx.length,
  });
});

router.get('/users', (_req, res) => {
  const sanitized = users.map(({ passwordHash, ...safe }) => safe);
  return res.json({ users: sanitized });
});

router.get('/reports/:userId', (req, res) => {
  const userWallets = wallets.filter((wallet) => wallet.userId === req.params.userId);
  if (!userWallets.length) {
    return res.status(404).json({ message: 'User or wallets not found' });
  }

  const compiled = userWallets.map((wallet) => ({
    wallet,
    report: generateReport(wallet, getWalletTransactions(wallet.id, 100), 'csv'),
  }));

  return res.json({
    reports: compiled.map(({ wallet, report }) => ({
      walletLabel: wallet.label,
      filename: report.filename,
      size: report.buffer.length,
    })),
  });
});

module.exports = router;
