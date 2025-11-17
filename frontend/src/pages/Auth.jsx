import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { handleApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', plan: 'free' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const magicToken = searchParams.get('token');
    if (magicToken) {
      (async () => {
        try {
          setLoading(true);
          const { data } = await api.post('/auth/passwordless/verify', { token: magicToken });
          login(data);
          navigate('/dashboard');
        } catch (error) {
          setStatus(handleApiError(error).message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams, login, navigate]);

  const updateField = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password, plan: form.plan };
      const { data } = await api.post(endpoint, payload);
      login(data);
      navigate('/dashboard');
      } catch (error) {
        setStatus(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const triggerMagicLink = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/auth/passwordless', { email: form.email });
      setStatus('Magic link sent! Check your inbox.');
    } catch (error) {
      setStatus(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await api.post('/auth/oauth/google', {
        token: crypto.randomUUID(),
        email: form.email || `security+${Date.now()}@cryptoguard.dev`,
        name: form.name || 'Google User',
      });
      login(data);
      navigate('/dashboard');
    } catch (error) {
      setStatus(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950">
      <div className="mx-auto max-w-md px-6 py-16 text-slate-100">
        <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">{mode === 'login' ? 'Login' : 'Create account'}</h1>
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setStatus(null);
              }}
              className="text-sm text-brand-300"
            >
              {mode === 'login' ? 'Need an account?' : 'Have an account?'}
            </button>
          </div>

          <form onSubmit={submitAuth} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Full name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Plan</label>
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={updateField}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                  >
                    <option value="free">Free (2 wallets)</option>
                    <option value="pro">Pro ($29/mo)</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
              />
            </div>
            {mode !== 'passwordless' && (
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  required={mode !== 'passwordless'}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400 disabled:opacity-70"
            >
              {loading ? 'Processing…' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-sm text-slate-300">
            <button onClick={triggerMagicLink} className="w-full rounded-full border border-white/10 px-4 py-3">
              Send passwordless magic link
            </button>
            <button onClick={loginWithGoogle} className="w-full rounded-full border border-white/10 px-4 py-3">
              Continue with Google OAuth
            </button>
          </div>
          {status && <p className="mt-4 text-center text-sm text-emerald-300">{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;
