import { Link } from 'react-router-dom';
import { Mail, ShieldHalf } from 'lucide-react';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { label: 'Twitter/X', href: 'https://twitter.com' },
  { label: 'Github', href: 'https://github.com' },
];

const Footer = () => (
  <footer className="border-t border-white/5 bg-slate-950">
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 text-lg font-semibold text-white">
          <ShieldHalf className="h-5 w-5 text-brand-400" />
          CryptoGuard
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Enterprise-grade wallet monitoring, alerts, and reporting for modern crypto teams.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Product</h4>
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
          <Link to="/features">Features</Link>
          <a href="#pricing">Pricing</a>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Company</h4>
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="/privacy" className="hover:text-slate-100">
            Privacy
          </a>
          <a href="/terms" className="hover:text-slate-100">
            Terms
          </a>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Stay Secure</h4>
        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-brand-400" />
            security@cryptoguard.dev
          </p>
          <div className="flex gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 transition hover:text-brand-300"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} CryptoGuard. All rights reserved.
    </div>
  </footer>
);

export default Footer;
