'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FadeInView from '@/components/animations/FadeInView';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Generate stars on client-side only to avoid hydration mismatch
  const [stars] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 2, // 2-4px
      duration: Math.random() * 3 + 2, // 2-5s
      delay: Math.random() * 2, // 0-2s
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Calculate opacity for each element based on scroll - memoized for performance
  // Sequential fade: Image (0-150px), Button (150-200px), Subheadline (200-250px), Headline (250-300px)
  const { buttonOpacity, subheadlineOpacity, headlineOpacity, imageOpacity } = useMemo(() => ({
    imageOpacity: Math.max(0, 1 - scrollY / 150),
    buttonOpacity: Math.max(0, 1 - Math.max(0, scrollY - 150) / 50),
    subheadlineOpacity: Math.max(0, 1 - Math.max(0, scrollY - 200) / 50),
    headlineOpacity: Math.max(0, 1 - Math.max(0, scrollY - 250) / 50),
  }), [scrollY]);

  return (
    <section className="relative" style={{
      background: 'linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 30%, rgb(49, 27, 84) 60%, rgb(74, 29, 88) 85%, rgb(88, 28, 70) 100%)',
      height: '1180px',
    }}>
      {/* Animated Stars - only render on client */}
      {mounted && stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 4px rgba(200, 150, 255, 0.6)',
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            zIndex: 0,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>

      {/* Sticky Text Container */}
      <div style={{
        position: 'sticky',
        top: '80px',
        zIndex: 1,
        paddingTop: '100px',
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Headline */}
            <FadeInView delay={0.1}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '20px',
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
                fontSize: '16px',
                fontWeight: 400,
                color: 'white',
                letterSpacing: '-0.01em',
                lineHeight: 1.6,
                marginBottom: '20px',
                maxWidth: '700px',
                margin: '0 auto 20px auto',
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
                  Get Started
                </Link>
              </div>
            </FadeInView>

            {/* Cupiduck Characters Image */}
            <FadeInView delay={0.4}>
              <div className="flex justify-center" style={{
                marginTop: '-20px',
                opacity: imageOpacity,
                transition: 'opacity 0.1s ease-out',
              }}>
                <Image
                  src="/cupiduck-duo.png"
                  alt="Cupiduck characters"
                  width={350}
                  height={233}
                  priority
                  style={{
                    objectFit: 'contain',
                    maxWidth: '350px',
                    width: '100%',
                    height: 'auto',
                  }}
                />
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
        zIndex: 1,
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <FadeInView delay={0.5}>
              <div
                className="rounded-t-3xl relative overflow-hidden"
                style={{
                  maxWidth: '900px',
                  margin: '0 auto',
                  height: '520px',
                  background: 'rgba(139, 92, 246, 0.12)',
                  borderTop: '3px solid rgba(168, 85, 247, 0.4)',
                  borderLeft: '3px solid rgba(168, 85, 247, 0.4)',
                  borderRight: '3px solid rgba(168, 85, 247, 0.4)',
                  borderBottom: 'none',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.37)',
                }}>
                <div style={{
                  position: 'absolute',
                  inset: '-80px',
                  background: 'radial-gradient(circle, rgba(200, 150, 255, 0.4) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                  zIndex: -1,
                  pointerEvents: 'none',
                }} />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                >
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </FadeInView>
          </div>
        </div>
      </div>
    </section>
  );
}
