import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import api, { handleApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ label: '', address: '', blockchain: 'BTC' });
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      fetchData();
    }
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ data: overviewData }, { data: alertData }] = await Promise.all([
        api.get('/wallets/overview'),
        api.get('/wallets/alerts'),
      ]);
      setOverview(overviewData);
      setAlerts(alertData.alerts);
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleConnectWallet = async (event) => {
    event.preventDefault();
    try {
      await api.post('/wallets', form);
      setForm({ label: '', address: '', blockchain: 'BTC' });
      fetchData();
    } catch (err) {
      setError(handleApiError(err).message);
    }
  };

  const downloadReport = async (walletId, format) => {
    try {
      const { data } = await api.get(`/wallets/${walletId}/export`, {
        responseType: 'blob',
        params: { format },
      });
      const blobUrl = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wallet-report-${walletId}.${format === 'pdf' ? 'pdf' : 'csv'}`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(handleApiError(err).message);
    }
  };

  const triggerTestNotification = async () => {
    try {
      await api.post('/notifications/test', { message: 'Testing alert pipeline' });
      setNotificationStatus('Notification sent! Check your inbox/logs.');
    } catch (err) {
      setNotificationStatus(handleApiError(err).message);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 text-white">
        <h1 className="text-3xl font-semibold">Security Dashboard</h1>
        <p className="mt-2 text-slate-300">Real-time wallets, transactions, alerts, and exports.</p>

        {error && <p className="mt-4 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>}

        {loading || !overview ? (
          <p className="mt-10 text-slate-400">Loading live data…</p>
        ) : (
          <>
            <section className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { label: 'Total wallets', value: overview.summary.totalWallets },
                { label: 'USD exposure', value: `$${overview.summary.totalUsd.toLocaleString()}` },
                { label: 'Avg health score', value: overview.summary.avgHealthScore },
              ].map((card) => (
                <div key={card.label} className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                </div>
              ))}
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Wallets</h2>
                  <span className="text-xs text-slate-400">BTC · ETH · SOL</span>
                </div>
                <div className="mt-6 space-y-4">
                  {overview.wallets.map((wallet) => (
                    <div key={wallet.id} className="rounded-2xl border border-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">{wallet.label}</p>
                          <p className="text-lg font-semibold text-white">{wallet.balance} {wallet.currency}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadReport(wallet.id, 'csv')}
                            className="rounded-full border border-white/10 p-2 text-xs text-slate-300"
                          >
                            <Download className="h-4 w-4" /> CSV
                          </button>
                          <button
                            onClick={() => downloadReport(wallet.id, 'pdf')}
                            className="rounded-full border border-white/10 p-2 text-xs text-slate-300"
                          >
                            <Download className="h-4 w-4" /> PDF
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{wallet.address.slice(0, 12)}…</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold">Connect Wallet</h2>
                <form onSubmit={handleConnectWallet} className="mt-4 space-y-4">
                  <input
                    name="label"
                    value={form.label}
                    onChange={handleChange}
                    placeholder="Wallet label"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                  />
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Public address"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                  />
                  <select
                    name="blockchain"
                    value={form.blockchain}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                  >
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum</option>
                    <option value="SOL">Solana</option>
                  </select>
                  <button className="w-full rounded-full bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400">
                    Connect Wallet
                  </button>
                </form>
                <button
                  onClick={triggerTestNotification}
                  className="mt-4 w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-200"
                >
                  Send test alert
                </button>
                {notificationStatus && (
                  <p className="mt-2 text-center text-xs text-emerald-300">{notificationStatus}</p>
                )}
              </div>
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold">Recent transactions</h2>
                <div className="mt-4 space-y-3">
                  {overview.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-white/5 p-4">
                      <div>
                        <p className="text-sm text-slate-300">{tx.hash.slice(0, 12)}…</p>
                        <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tx.direction === 'incoming' ? (
                          <ArrowDownLeft className="h-5 w-5 text-emerald-300" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-rose-300" />
                        )}
                        <p className="text-white">
                          {tx.amount} {tx.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                  Real-time alerts
                </h2>
                <div className="mt-4 space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="rounded-2xl border border-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{alert.type.replace('_', ' ')}</p>
                      <p className="text-sm text-slate-300">{alert.description || alert.detail}</p>
                      <p className="text-xs text-slate-500">{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
