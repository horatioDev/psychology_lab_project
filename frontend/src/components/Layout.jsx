import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
  }`;

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold text-brand-600">
            MERN Starter
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/pricing" className={navLinkClass}>
              Pricing
            </NavLink>
            <SignedIn>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link to="/sign-in" className="btn-primary">
                Sign In
              </Link>
            </SignedOut>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        MERN Starter Kit — MongoDB, Express, React, Node.js
      </footer>
    </div>
  );
}
