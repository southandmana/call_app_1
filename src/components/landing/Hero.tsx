'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FadeInView from '@/components/animations/FadeInView';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity for each element based on scroll
  // Button fades out first (0-150px), then subheadline (150-250px), then headline (250-350px)
  const buttonOpacity = Math.max(0, 1 - scrollY / 150);
  const subheadlineOpacity = Math.max(0, 1 - Math.max(0, scrollY - 50) / 150);
  const headlineOpacity = Math.max(0, 1 - Math.max(0, scrollY - 100) / 150);

  return (
    <section className="relative" style={{
      background: 'var(--bg-primary)',
      height: '1200px',
    }}>
      {/* Sticky Text Container */}
      <div style={{
        position: 'sticky',
        top: '160px',
        zIndex: 1,
        paddingTop: '40px',
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Headline */}
            <FadeInView delay={0.1}>
              <h1 style={{
                fontSize: '64px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '24px',
                color: 'var(--text-primary)',
                opacity: headlineOpacity,
                transition: 'opacity 0.1s ease-out',
              }}>
                Find Real Connections <br />Through Voice
              </h1>
            </FadeInView>

            {/* Subheadline */}
            <FadeInView delay={0.2}>
              <p style={{
                fontSize: '20px',
                fontWeight: 400,
                color: 'var(--text-tertiary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.6,
                marginBottom: '40px',
                maxWidth: '700px',
                margin: '0 auto 40px auto',
                opacity: subheadlineOpacity,
                transition: 'opacity 0.1s ease-out',
              }}>
                Talk first, see later. Build genuine connections based on personality, not profiles.
              </p>
            </FadeInView>

            {/* CTA Button */}
            <FadeInView delay={0.3}>
              <div className="flex justify-center" style={{
                opacity: buttonOpacity,
                transition: 'opacity 0.1s ease-out',
              }}>
                <Link
                  href="/auth/signin"
                  style={{
                    padding: '16px 32px',
                    background: 'var(--accent)',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    border: 'none',
                  }}
                  className="hover:opacity-90 hover:scale-105"
                >
                  Start Your First Call (Free)
                </Link>
              </div>
            </FadeInView>
          </div>
        </div>
      </div>

      {/* Purple Div - Absolutely positioned at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <FadeInView delay={0.4}>
              <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                height: '500px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(236, 72, 153, 1) 100%)',
                borderRadius: '24px 24px 0 0',
                position: 'relative',
              }}>
                {/* Glow effect */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '80%',
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                  zIndex: 0,
                }} />
              </div>
            </FadeInView>
          </div>
        </div>
      </div>
    </section>
  );
}
