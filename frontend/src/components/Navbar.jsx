import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShieldHalf, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '#pricing', isAnchor: true },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleNavClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-white/5 bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm font-medium text-slate-100">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500">
            <ShieldHalf className="h-5 w-5 text-white" />
          </span>
          CryptoGuard
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a key={link.label} href={link.to} className="text-slate-100 transition hover:text-brand-300">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-brand-300 ${
                    isActive ? 'text-brand-300' : 'text-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
          <Link
            to="/features"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-slate-200"
          >
            Use Cases
          </Link>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full border border-brand-400/40 px-4 py-2 font-semibold text-brand-200"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 px-4 py-2 font-semibold text-slate-300"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-slate-200">
                Login
              </Link>
              <Link
                to="/auth"
                className="rounded-full bg-brand-500 px-4 py-2 font-semibold text-white shadow-glow transition hover:bg-brand-400"
              >
                Start Securing
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(true)} className="lg:hidden text-slate-100">
          <Menu className="h-6 w-6" />
        </button>

        {open && (
          <div className="fixed inset-0 z-40 bg-slate-950/90 lg:hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <ShieldHalf className="h-5 w-5 text-brand-400" />
                CryptoGuard
              </span>
              <button onClick={() => setOpen(false)}>
                <X className="h-6 w-6 text-slate-200" />
              </button>
            </div>
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a key={link.label} href={link.to} onClick={handleNavClick} className="text-lg text-slate-200">
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    onClick={handleNavClick}
                    className="text-lg text-slate-200"
                  >
                    {link.label}
                  </NavLink>
                )
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={handleNavClick} className="text-lg text-brand-200">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      handleNavClick();
                    }}
                    className="text-left text-lg text-slate-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={handleNavClick} className="text-lg text-slate-200">
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    onClick={handleNavClick}
                    className="rounded-full bg-brand-500 px-4 py-2 text-center font-semibold text-white"
                  >
                    Start Securing
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
