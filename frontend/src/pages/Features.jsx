import { Activity, BellRing, Briefcase, KeyRound, Shield, Wallet } from 'lucide-react';

const capabilityCards = [
  {
    title: 'Blockchain coverage',
    description: 'Native integrations for Bitcoin, Ethereum, and Solana with balance and transaction sync.',
    items: ['Live balance polling', 'Smart contract monitoring', 'Fee intelligence'],
    icon: Wallet,
  },
  {
    title: 'Alerts & notifications',
    description:
      'Threshold-based alerts for large transfers, geo anomalies, unknown counterparties, and failed access.',
    items: ['Email + webhook alerts', 'Slack & PagerDuty ready payloads', 'Test notification API'],
    icon: BellRing,
  },
  {
    title: 'Enterprise reporting',
    description: 'One-click CSV and PDF exports plus automated weekly digest to finance and compliance teams.',
    items: ['Role-based access control', 'SOC 2 aligned audit trails', 'Custom data retention policies'],
    icon: Briefcase,
  },
  {
    title: 'Access & auth',
    description: 'JWT authentication, passwordless magic links, and Google OAuth keep teams secure.',
    items: ['SAML ready architecture', 'Session expiry controls', 'Fine-grained roles per plan'],
    icon: KeyRound,
  },
  {
    title: 'Suspicious activity AI',
    description:
      'Detectors surface large transfers, repeated failures, and risky counterparties with context & actions.',
    items: ['Adaptive thresholds', 'Risk scoring dashboard', 'Automated case notes'],
    icon: Activity,
  },
  {
    title: 'Security by design',
    description: 'Hardened APIs, environment-isolated secrets, and compliance-friendly logging.',
    items: ['Rate limiting', 'Audit-ready exports', 'Ops-focused runbooks'],
    icon: Shield,
  },
];

const Features = () => (
  <div className="bg-slate-950">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-300">Feature Deep Dive</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Purpose-built for security operations.</h1>
        <p className="mx-auto mt-3 max-w-3xl text-base text-slate-300">
          CryptoGuard unifies wallet monitoring, alerting, reporting, and compliance workflows in a single
          secure stack. Everything teams need for BTC, ETH, and SOL coverage.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {capabilityCards.map((capability) => (
          <div
            key={capability.title}
            className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-6"
          >
            <capability.icon className="h-10 w-10 text-brand-400" />
            <h3 className="mt-4 text-xl font-semibold text-white">{capability.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{capability.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-200">
              {capability.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Features;
