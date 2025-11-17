const LARGE_TRANSFER_THRESHOLD = {
  BTC: 0.75,
  ETH: 5,
  SOL: 250,
};

const detectLargeTransfer = (tx) => {
  const threshold = LARGE_TRANSFER_THRESHOLD[tx.blockchain] || 100;
  if (tx.amount >= threshold) {
    return {
      severity: 'high',
      type: 'large_transfer',
      detail: `Transfer of ${tx.amount} ${tx.currency} exceeded ${threshold} ${tx.currency}`,
      tx,
    };
  }
  return null;
};

const detectUnknownCounterparty = (tx, history) => {
  const hasHistory = history.some(
    (historicTx) => historicTx.counterparty === tx.counterparty && historicTx.id !== tx.id
  );
  if (!hasHistory && tx.direction === 'outgoing') {
    return {
      severity: 'medium',
      type: 'unknown_counterparty',
      detail: `Outgoing transfer to a new address ${tx.counterparty}`,
      tx,
    };
  }
  return null;
};

const detectRapidFailures = (walletMetrics) => {
  if (walletMetrics.failedAttempts >= 3) {
    return {
      severity: 'high',
      type: 'repeated_failures',
      detail: `Detected ${walletMetrics.failedAttempts} failed access attempts`,
    };
  }
  return null;
};

const collectSuspiciousActivity = (wallet, txs, walletMetrics = { failedAttempts: 0 }) => {
  const alerts = [];

  for (const tx of txs) {
    const largeTransfer = detectLargeTransfer(tx);
    if (largeTransfer) {
      alerts.push(largeTransfer);
    }

    const unknownCounterparty = detectUnknownCounterparty(tx, txs);
    if (unknownCounterparty) {
      alerts.push(unknownCounterparty);
    }

    if (tx.risk === 'high') {
      alerts.push({
        severity: 'high',
        type: 'high_risk_provider',
        detail: 'Transaction flagged as high risk by heuristics.',
        tx,
      });
    }
  }

  const rapidFailures = detectRapidFailures(walletMetrics);
  if (rapidFailures) {
    alerts.push(rapidFailures);
  }

  return alerts.map((alert) => ({
    ...alert,
    walletId: wallet.id,
    createdAt: new Date().toISOString(),
  }));
};

module.exports = {
  collectSuspiciousActivity,
};
