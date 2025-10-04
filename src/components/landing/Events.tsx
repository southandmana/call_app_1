import Link from 'next/link';

export default function Events() {
  const eventCategories = [
    { icon: '☕', name: 'Coffee Meetups' },
    { icon: '🎮', name: 'Game Nights' },
    { icon: '🎵', name: 'Music Events' },
    { icon: '⚽', name: 'Sports & Fitness' },
  ];

  return (
    <section id="events" style={{
      background: 'var(--bg-secondary)',
      paddingTop: '80px',
      paddingBottom: '80px',
    }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Headline */}
        <div className="text-center mb-16">
          <h2 style={{
            fontSize: '40px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            color: 'var(--text-primary)',
          }}>
            More Than Dating: Build Your Community
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-tertiary)',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            Discover local events and meetups. Turn online connections into real-world friendships.
          </p>
        </div>

        {/* Map Placeholder */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '24px',
          padding: '60px 40px',
          border: '1px solid var(--border-primary)',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Gradient background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
          }} />

          {/* Map Placeholder Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
              {/* Simulated Map Markers */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50% 50% 50% 0',
                    background: 'var(--accent)',
                    transform: 'rotate(-45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                  }}
                >
                  <span style={{ transform: 'rotate(45deg)' }}>📍</span>
                </div>
              ))}
            </div>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '14px',
            }}>
              [Screenshot: Events map with interactive markers showing local meetups]
            </p>
          </div>
        </div>

        {/* Event Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {eventCategories.map((category, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-primary)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              className="hover:border-[var(--border-secondary)]"
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                {category.icon}
              </div>
              <p style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {category.name}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
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
              display: 'inline-block',
              transition: 'all 0.2s',
            }}
            className="hover:opacity-90"
          >
            Explore Events Near You
          </Link>
        </div>
      </div>
    </section>
  );
}
