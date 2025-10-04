import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--accent) 0%, #ec4899 100%)',
      paddingTop: '80px',
      paddingBottom: '80px',
    }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 style={{
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: '24px',
          color: 'white',
        }}>
          Ready to Find Your People?
        </h2>

        {/* Subheadline */}
        <p style={{
          fontSize: '20px',
          lineHeight: 1.6,
          marginBottom: '40px',
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '600px',
          margin: '0 auto 40px auto',
        }}>
          Join thousands of users making real connections through voice.
        </p>

        {/* CTA Button */}
        <Link
          href="/auth/signin"
          style={{
            padding: '18px 40px',
            background: 'white',
            color: 'var(--accent)',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
          className="hover:shadow-xl hover:scale-105"
        >
          Start Calling (Free)
        </Link>
      </div>
    </section>
  );
}
