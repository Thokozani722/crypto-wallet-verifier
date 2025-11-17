import { ArrowRight, BellRing, LineChart, ShieldCheck, Wallet } from 'lucide-react';
import CTASection from '../components/CTASection';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Multi-Wallet Monitoring',
    description: 'Track BTC, ETH, and SOL wallets in one secure pane of glass.',
    icon: Wallet,
  },
  {
    title: 'Real-time Alerts',
    description: 'Get instant push, email, and webhook notifications for threats.',
    icon: BellRing,
  },
  {
    title: 'Suspicious Activity Detection',
    description: 'Machine rules highlight large transfers and unknown addresses.',
    icon: ShieldCheck,
  },
  {
    title: 'Enterprise-grade Security',
    description: 'Role-based access, reporting, and compliance-ready exports.',
    icon: LineChart,
  },
];

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Monitor your first wallets for free.',
    features: ['2 wallets', 'Email alerts', 'CSV exports'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Growth teams needing deeper coverage.',
    features: ['10 wallets', 'Webhook alerts', 'Magic-link login', 'Priority support'],
    highlight: true,
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Unlimited scale with dedicated security advisors.',
    features: ['Unlimited wallets', 'Role-based access', 'Dedicated CSM', 'SOC2 reports'],
    cta: 'Contact Sales',
  },
];

const testimonials = [
  {
    quote:
      'CryptoGuard reduced our investigation time from hours to minutes. Alerts arrive instantly with context.',
    person: 'Maya Patel',
    role: 'Head of Security, LayerLabs',
  },
  {
    quote: 'The enterprise reporting unlocked compliance wins for our finance org on day one.',
    person: 'Carlos Mendes',
    role: 'VP Finance, NovaX',
  },
];

const Home = () => (
  <div className="gradient-bg">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Crypto Wallet Security</p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            Secure every wallet. Verify every transaction.
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            CryptoGuard is the security co-pilot for monitoring BTC, ETH, and SOL wallets with real-time
            alerts, suspicious activity detection, and export-ready reports.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/auth"
              className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:bg-brand-400"
            >
              Start Securing Your Wallets Today
            </Link>
            <Link
              to="/features"
              className="flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-slate-200"
            >
              See Features <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Live Wallet Status</span>
            <span>BTC · ETH · SOL</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {['BTC Treasury', 'ETH Ops', 'SOL Gaming', 'Compliance'].map((label) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {Math.random().toFixed(2)}Ξ
                </p>
                <p className="text-xs text-emerald-300">Healthy</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-brand-400/40"
          >
            <feature.icon className="h-10 w-10 text-brand-400" />
            <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
          </div>
        ))}
      </section>

      <section id="pricing" className="mt-20">
        <p className="text-center text-xs uppercase tracking-[0.4em] text-brand-300">Pricing</p>
        <h2 className="mt-3 text-center text-3xl font-semibold text-white">Plans for every team size</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl border p-6 ${
                tier.highlight ? 'border-brand-400 bg-slate-900/80 shadow-glow' : 'border-white/5 bg-slate-900/50'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{tier.name}</p>
              <p className="mt-4 text-4xl font-bold text-white">{tier.price}</p>
              <p className="text-sm text-slate-400">{tier.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-200">
                {tier.features.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-8 block rounded-full px-4 py-2 text-center font-semibold ${
                  tier.highlight
                    ? 'bg-brand-500 text-white shadow-glow hover:bg-brand-400'
                    : 'border border-white/10 text-slate-200 hover:bg-white/10'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div key={testimonial.person} className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
            <p className="text-lg text-slate-100">“{testimonial.quote}”</p>
            <p className="mt-4 text-sm font-semibold text-white">{testimonial.person}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{testimonial.role}</p>
          </div>
        ))}
      </section>

      <div className="mt-20">
        <CTASection />
      </div>
    </div>
  </div>
);

export default Home;
