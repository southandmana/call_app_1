import Link from 'next/link';

export default function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Unlimited random calls (10 min each)',
        'Interest & country filters',
        'Friend system',
        'Events discovery',
        'Direct messaging (friends)',
        'Safety & moderation',
      ],
      cta: 'Start Free',
      ctaLink: '/auth/signin',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      features: [
        'Everything in Free, plus:',
        'Unlimited call duration',
        'Gender filter',
        'Priority matching (faster)',
        'Profile boost',
        'Advanced stats',
      ],
      cta: 'Start 7-Day Free Trial',
      ctaLink: '/auth/signin',
      popular: true,
    },
    {
      name: 'Premium + AI',
      price: '$19.99',
      period: '/month',
      features: [
        'Everything in Premium, plus:',
        'Matcher AI voice interview',
        'Daily AI-curated matches',
        'Unlimited AI suggestions',
        'Re-run interview monthly',
      ],
      cta: 'Start Trial',
      ctaLink: '/auth/signin',
      popular: false,
    },
  ];

  return (
    <section id="pricing" style={{
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
            Choose Your Plan
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-tertiary)',
          }}>
            Start free. Upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '40px 32px',
                border: tier.popular ? '2px solid var(--accent)' : '1px solid var(--border-primary)',
                position: 'relative',
                transition: 'all 0.2s',
              }}
              className="hover:border-[var(--accent)]"
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  Most Popular
                </div>
              )}

              {/* Tier Name */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}>
                {tier.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {tier.price}
                </span>
                <span style={{
                  fontSize: '18px',
                  color: 'var(--text-tertiary)',
                }}>
                  {tier.period}
                </span>
              </div>

              {/* Features List */}
              <ul style={{ marginBottom: '32px', listStyle: 'none', padding: 0 }}>
                {tier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: '16px',
                      lineHeight: 2,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={tier.ctaLink}
                style={{
                  display: 'block',
                  padding: '14px 24px',
                  background: tier.popular ? 'var(--accent)' : 'transparent',
                  color: tier.popular ? 'white' : 'var(--accent)',
                  border: tier.popular ? 'none' : '1px solid var(--accent)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className={tier.popular ? 'hover:opacity-90' : 'hover:bg-[var(--accent)] hover:text-white'}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--text-tertiary)',
        }}>
          All plans include ID verification, real-time moderation, and safety features
        </p>
      </div>
    </section>
  );
}
