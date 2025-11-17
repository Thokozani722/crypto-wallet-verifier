const express = require('express');
const config = require('../config');
const { authenticate } = require('../middleware/auth');
const { wallets, transactions, alerts } = require('../data/mockData');
const {
  getWalletBalances,
  getWalletTransactions,
  upsertWallet,
  removeWallet,
  SUPPORTED_CHAINS,
} = require('../services/blockchainService');
const { collectSuspiciousActivity } = require('../utils/suspiciousDetector');
const { generateReport } = require('../services/reportService');
const { sendAlertNotification } = require('../services/notificationService');

const router = express.Router();

router.use(authenticate);

router.get('/supported', (_req, res) => {
  return res.json({ blockchains: SUPPORTED_CHAINS });
});

router.get('/overview', (req, res) => {
  const walletSummaries = getWalletBalances(req.user.id);
  const totalUsd = walletSummaries.reduce((sum, w) => sum + (w.usdValue || 0), 0);
  const recentTransactions = transactions
    .filter((tx) => walletSummaries.some((wallet) => wallet.id === tx.walletId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  const generatedAlerts = walletSummaries.flatMap((wallet) =>
    collectSuspiciousActivity(wallet, getWalletTransactions(wallet.id, 10))
  );

  return res.json({
    summary: {
      totalWallets: walletSummaries.length,
      totalUsd: Number(totalUsd.toFixed(2)),
      avgHealthScore:
        walletSummaries.length > 0
          ? Math.round(walletSummaries.reduce((sum, w) => sum + w.healthScore, 0) / walletSummaries.length)
          : 0,
    },
    wallets: walletSummaries,
    recentTransactions,
    generatedAlerts,
  });
});

router.get('/alerts', async (req, res) => {
  const walletSummaries = getWalletBalances(req.user.id);
  const detectedAlerts = walletSummaries.flatMap((wallet) =>
    collectSuspiciousActivity(wallet, getWalletTransactions(wallet.id, 10))
  );

  // send email for the most critical alert
  const criticalAlert = detectedAlerts.find((alert) => alert.severity === 'high');
  if (criticalAlert) {
    await sendAlertNotification(req.user, criticalAlert);
  }

  const userAlertIds = walletSummaries.map((wallet) => wallet.id);
  const persistedAlerts = alerts.filter((alert) => userAlertIds.includes(alert.walletId));

  return res.json({ alerts: [...persistedAlerts, ...detectedAlerts] });
});

router.post('/', (req, res) => {
  try {
    const { address, blockchain, label } = req.body;
    if (!address || !blockchain || !label) {
      return res.status(400).json({ message: 'Address, blockchain, and label are required' });
    }

    const limit = config.planLimits[req.user.plan] ?? config.planLimits.free;
    const existing = wallets.filter((wallet) => wallet.userId === req.user.id);
    if (existing.length >= limit) {
      return res
        .status(403)
        .json({ message: `Plan limit reached. Upgrade to add more than ${limit} wallets.` });
    }

    const wallet = upsertWallet({ userId: req.user.id, address, blockchain, label });
    return res.status(201).json({ wallet });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete('/:walletId', (req, res) => {
  try {
    removeWallet(req.params.walletId, req.user.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

router.get('/:walletId/transactions', (req, res) => {
  const wallet = wallets.find(
    (item) => item.id === req.params.walletId && item.userId === req.user.id
  );
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }
  const txs = getWalletTransactions(wallet.id);
  return res.json({ wallet, transactions: txs });
});

router.get('/:walletId/export', (req, res) => {
  const wallet = wallets.find(
    (item) => item.id === req.params.walletId && item.userId === req.user.id
  );
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }
  const format = req.query.format === 'pdf' ? 'pdf' : 'csv';
  const txs = getWalletTransactions(wallet.id, 100);
  const report = generateReport(wallet, txs, format);
  res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
  res.setHeader('Content-Type', report.mime);
  return res.send(report.buffer);
});

module.exports = router;
