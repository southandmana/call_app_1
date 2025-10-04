'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Events', href: '#events' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'var(--bg-primary)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled
          ? '1px solid var(--border-primary)'
          : '1px solid transparent',
        boxShadow: isScrolled
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          : 'none',
        height: isScrolled ? '64px' : '80px',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none', // Safari support
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="CQPDUK"
            className="logo"
            style={{
              height: isScrolled ? '28px' : '32px',
              width: 'auto',
              transition: 'height 0.3s ease',
            }}
          />
        </Link>

        {/* Navigation Links - Hidden on mobile, visible on desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              className="hover:text-[var(--text-primary)]"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
