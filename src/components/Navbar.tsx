'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Anchor } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: 'ホーム' },
  { href: '/decks', label: 'デッキ一覧' },
  { href: '/meta', label: '環境/Tier' },
  { href: '/articles', label: '攻略記事' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-yellow-600/40 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Anchor className="w-6 h-6 text-yellow-500 group-hover:rotate-12 transition-transform" />
            <span className="text-yellow-400 font-black text-xl tracking-wider">
              ONE<span className="text-white">CARD</span>
            </span>
            <span className="hidden sm:block text-gray-400 text-xs ml-1">攻略</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-yellow-600/20 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-600/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'block px-4 py-3 text-sm font-medium border-b border-gray-800 transition-colors',
                pathname === link.href
                  ? 'text-yellow-400 bg-yellow-600/10'
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800'
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
