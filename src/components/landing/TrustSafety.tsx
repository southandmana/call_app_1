export default function TrustSafety() {
  const safetyFeatures = [
    {
      icon: '🛡️',
      title: 'ID Verification Required',
      description: 'Government ID verification ensures all users are 18+ and real people.',
    },
    {
      icon: '👁️',
      title: 'Real-Time AI Moderation',
      description: 'Every call is monitored for harmful content. Violations result in immediate action.',
    },
    {
      icon: '⭐',
      title: 'Community-Driven Trust',
      description: 'Rate your calls. Low-rated users are warned or removed to maintain quality.',
    },
    {
      icon: '🆘',
      title: 'Emergency Panic Button',
      description: 'Meeting in person? One tap alerts your emergency contacts with your location.',
    },
  ];

  return (
    <section style={{
      background: 'var(--bg-primary)',
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
            Your Safety is Our Priority
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-tertiary)',
          }}>
            Multiple layers of protection to keep you safe
          </p>
        </div>

        {/* 2x2 Grid on desktop, stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {safetyFeatures.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '40px',
                border: '1px solid var(--border-primary)',
                transition: 'all 0.2s',
              }}
              className="hover:border-[var(--border-secondary)]"
            >
              {/* Icon */}
              <div style={{
                fontSize: '48px',
                marginBottom: '20px',
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                color: 'var(--text-primary)',
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--text-tertiary)',
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges & Link */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
            <div style={{
              padding: '12px 24px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}>
              🔒 GDPR Compliant
            </div>
            <div style={{
              padding: '12px 24px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}>
              🔐 End-to-End Encrypted Calls
            </div>
          </div>

          <a
            href="/legal/guidelines"
            style={{
              color: 'var(--accent)',
              fontSize: '16px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
            className="hover:underline"
          >
            View Community Guidelines →
          </a>
        </div>
      </div>
    </section>
  );
}
