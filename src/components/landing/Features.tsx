export default function Features() {
  const features = [
    {
      title: 'Smart Filters',
      description: 'Match by country, interests, and more. Premium users get gender filters.',
      icon: '🎯',
      screenshotPlaceholder: '[Screenshot: Filter menu UI]',
    },
    {
      title: 'Meet in Person',
      description: 'Discover local events and meetups. Build your social circle beyond the app.',
      icon: '📍',
      screenshotPlaceholder: '[Screenshot: Events map with markers]',
    },
    {
      title: 'Matcher AI Finds Your Perfect Match',
      description: 'Voice interview analyzes your personality. AI suggests compatible connections daily.',
      icon: '🤖',
      screenshotPlaceholder: '[Screenshot: Matcher AI interview UI]',
      premium: true,
    },
    {
      title: 'Built on Trust',
      description: 'Ratings, verified IDs, and real-time moderation keep the community safe.',
      icon: '🛡️',
      screenshotPlaceholder: '[Screenshot: User profile with rating badge]',
    },
    {
      title: 'Avatars That Talk',
      description: 'Your avatar speaks when you do. Maintain anonymity while feeling connected.',
      icon: '🗣️',
      screenshotPlaceholder: '[Screenshot: Avatar with mouth moving]',
    },
    {
      title: 'Unlock Premium',
      description: 'Unlimited calls, priority matching, gender filters, and more for $9.99/month.',
      icon: '⭐',
      screenshotPlaceholder: '[Screenshot: Premium benefits list]',
      premium: true,
    },
  ];

  return (
    <section id="features" style={{
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
          What Makes CQPDUK Different?
        </h2>

        {/* Features Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-primary)',
                borderRadius: '16px',
                border: '1px solid var(--border-primary)',
                overflow: 'hidden',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              className="hover:border-[var(--border-secondary)] hover:shadow-lg"
            >
              {/* Premium Badge */}
              {feature.premium && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  Premium
                </div>
              )}

              {/* Screenshot Placeholder */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px',
              }}>
                {feature.icon}
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: 'var(--text-primary)',
                }}>
                  {feature.title}
                </h3>

                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--text-tertiary)',
                  marginBottom: '16px',
                }}>
                  {feature.description}
                </p>

                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                }}>
                  {feature.screenshotPlaceholder}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
