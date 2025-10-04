import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{
      background: 'var(--bg-primary)',
      paddingTop: '160px', // Increased to account for fixed header
      paddingBottom: '80px',
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          {/* Headline */}
          <h1 style={{
            fontSize: '64px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '24px',
            color: 'var(--text-primary)',
          }}>
            Find Real Connections <br />Through Voice
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: '20px',
            fontWeight: 400,
            color: 'var(--text-tertiary)',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
          }}>
            Talk first, see later. Build genuine connections based on personality, not profiles.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
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
              className="hover:opacity-90"
            >
              Start Your First Call (Free)
            </Link>
          </div>

          {/* Hero Illustration Placeholder */}
          <div style={{
            marginTop: '80px',
            maxWidth: '900px',
            margin: '80px auto 0 auto',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              borderRadius: '24px',
              padding: '80px 40px',
              border: '1px solid var(--border-primary)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Placeholder content */}
              <div className="flex items-center justify-center gap-12">
                {/* Left Avatar */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  opacity: 0.6,
                }}></div>

                {/* Voice Wave Animation Placeholder */}
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '4px',
                        height: `${40 + (i % 3) * 20}px`,
                        background: 'var(--accent)',
                        borderRadius: '2px',
                        opacity: 0.7,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Right Avatar */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#ec4899',
                  opacity: 0.6,
                }}></div>
              </div>

              {/* Placeholder text */}
              <p style={{
                marginTop: '24px',
                color: 'var(--text-tertiary)',
                fontSize: '14px',
                textAlign: 'center',
              }}>
                [Hero Illustration: Two avatars with voice wave animation]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
