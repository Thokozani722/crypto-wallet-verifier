import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Thanks! Our security team will reach out within 1 business day.');
    setForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="bg-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-16 text-slate-100">
        <h1 className="text-4xl font-semibold">Contact</h1>
        <p className="mt-4 text-base text-slate-300">
          Need a guided pilot or custom enterprise plan? Drop us a note and we will respond quickly.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/5 bg-slate-900/40 p-6">
            {['name', 'email', 'company'].map((field) => (
              <div key={field}>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {field === 'email' ? 'Work Email' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  required={field !== 'company'}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  type={field === 'email' ? 'email' : 'text'}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">How can we help?</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
              />
            </div>
            <button className="w-full rounded-full bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400">
              Submit
            </button>
            {status && <p className="text-sm text-emerald-300">{status}</p>}
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Talk to us</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-200">
                <Mail className="h-4 w-4 text-brand-300" />
                security@cryptoguard.dev
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-200">
                <Phone className="h-4 w-4 text-brand-300" />
                +1 (415) 555-0133
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">HQ</p>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-200">
                <MapPin className="h-4 w-4 text-brand-300" />
                995 Market St, San Francisco, CA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
