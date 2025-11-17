import { Link } from 'react-router-dom';

const CTASection = () => (
  <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-12 text-center shadow-glow">
    <div className="mx-auto max-w-2xl">
      <p className="text-xs uppercase tracking-[0.3em] text-white/80">Sign Up Now</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">
        Start securing every wallet and transaction today.
      </h3>
      <p className="mt-3 text-base text-white/80">
        Deploy CryptoGuard in minutes. Monitor BTC, ETH, and SOL wallets with enterprise-ready alerts,
        reporting, and compliance exports.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          to="/auth"
          className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 shadow hover:bg-slate-100"
        >
          Start Securing Your Wallets Today
        </Link>
        <Link
          to="/contact"
          className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10"
        >
          Talk to Security Team
        </Link>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%)]" />
    </div>
  </section>
);

export default CTASection;
