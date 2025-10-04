'use client';

import { useState } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: 'I met my best friend on CQPDUK after just 3 calls. The voice-first approach made it so easy to connect authentically.',
      name: 'Sarah',
      age: 26,
      city: 'New York',
      avatarPlaceholder: '👩',
    },
    {
      quote: 'I was skeptical at first, but after talking to people without seeing photos, I realized how much personality matters. Found my girlfriend here!',
      name: 'Marcus',
      age: 31,
      city: 'Los Angeles',
      avatarPlaceholder: '👨',
    },
    {
      quote: 'The events feature helped me build a social circle in a new city. Way better than awkward Meetup.com events.',
      name: 'Emily',
      age: 28,
      city: 'London',
      avatarPlaceholder: '👩‍🦰',
    },
    {
      quote: 'Matcher AI nailed it. First suggestion became my partner. The compatibility analysis is scarily accurate.',
      name: 'Alex',
      age: 29,
      city: 'Toronto',
      avatarPlaceholder: '🧑',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section style={{
      background: 'var(--bg-secondary)',
      paddingTop: '80px',
      paddingBottom: '80px',
    }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Headline */}
        <h2 style={{
          fontSize: '40px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          marginBottom: '60px',
          color: 'var(--text-primary)',
        }}>
          What Our Users Say
        </h2>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: '16px',
            padding: '48px',
            border: '1px solid var(--border-primary)',
            position: 'relative',
          }}>
            {/* Quote */}
            <p style={{
              fontSize: '24px',
              lineHeight: 1.6,
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              marginBottom: '32px',
              textAlign: 'center',
            }}>
              "{current.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              {/* Avatar Placeholder */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                {current.avatarPlaceholder}
              </div>

              {/* Name & Location */}
              <div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {current.name}, {current.age}
                </p>
                <p style={{
                  fontSize: '16px',
                  color: 'var(--text-tertiary)',
                }}>
                  {current.city}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prev}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontSize: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              className="hover:bg-[var(--bg-tertiary)]"
            >
              ←
            </button>
            <button
              onClick={next}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontSize: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              className="hover:bg-[var(--bg-tertiary)]"
            >
              →
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentIndex ? 'var(--accent)' : 'var(--border-primary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
