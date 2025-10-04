export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Press "Call"',
      description: 'Set your interests and filters. We\'ll match you with someone compatible in seconds.',
      visual: '📞',
    },
    {
      number: '2',
      title: 'Talk for 10 Minutes',
      description: 'Voice-only conversation. No photos, no profiles—just authentic chat. Free users get 10 minutes per call.',
      visual: '🎙️',
    },
    {
      number: '3',
      title: 'Rate Each Other',
      description: 'How\'d it go? Rate your experience and add them as a friend if you clicked.',
      visual: '⭐',
    },
    {
      number: '4',
      title: 'Connect or Move On',
      description: 'Friends can call anytime, message, and meet in person. Or press "Next" to find someone new.',
      visual: '🤝',
    },
  ];

  return (
    <section id="how-it-works" style={{
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
            How It Works
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'var(--text-tertiary)',
          }}>
            Four simple steps to genuine connections
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step Number Circle */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 700,
                margin: '0 auto 24px auto',
              }}>
                {step.number}
              </div>

              {/* Visual Icon */}
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>
                {step.visual}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                color: 'var(--text-primary)',
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--text-tertiary)',
              }}>
                {step.description}
              </p>

              {/* Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block" style={{
                  position: 'absolute',
                  right: '-40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '24px',
                  color: 'var(--text-muted)',
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Flow Diagram Placeholder */}
        <div style={{
          marginTop: '60px',
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid var(--border-primary)',
        }}>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
          }}>
            [Flow Diagram: Animated visualization of avatars moving through each step]
          </p>
        </div>
      </div>
    </section>
  );
}
