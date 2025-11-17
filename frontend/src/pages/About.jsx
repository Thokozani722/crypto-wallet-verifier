const milestones = [
  { year: '2023', detail: 'Launched CryptoGuard beta with BTC monitoring and webhook alerts.' },
  { year: '2024', detail: 'Added Solana monitoring, passwordless authentication, and enterprise reporting.' },
  { year: '2025', detail: 'SOC 2 readiness, AI-driven anomaly scoring, and policy automation.' },
];

const values = [
  { title: 'Security first', copy: 'We threat-model every feature and log every action for transparency.' },
  { title: 'Automation obsessed', copy: 'Manual investigation steps are encoded into workflows and alerts.' },
  { title: 'Team focused', copy: 'Role-based access and contextual insights keep ops, finance, and compliance aligned.' },
];

const About = () => (
  <div className="bg-slate-950">
    <div className="mx-auto max-w-5xl px-6 py-16 text-slate-100">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-300">About</p>
        <h1 className="mt-4 text-4xl font-semibold">Why we built CryptoGuard</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300">
          Our team is made up of crypto security engineers and compliance leads who were tired of bolting
          together scripts and spreadsheets to monitor wallets. CryptoGuard distills the best practices from
          exchanges, DAOs, and custodians into one platform.
        </p>
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-3xl border border-white/5 bg-slate-900/50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">{value.title}</p>
            <p className="mt-3 text-sm text-slate-200">{value.copy}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-white/5 bg-slate-900/40 p-6">
        <h2 className="text-2xl font-semibold text-white">Milestones</h2>
        <div className="mt-6 space-y-4">
          {milestones.map((item) => (
            <div key={item.year} className="flex flex-col gap-2 border-l border-brand-500/40 pl-4">
              <p className="text-sm font-semibold text-brand-200">{item.year}</p>
              <p className="text-sm text-slate-200">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default About;
