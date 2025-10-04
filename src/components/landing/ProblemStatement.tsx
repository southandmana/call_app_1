export default function ProblemStatement() {
  const problems = [
    {
      icon: '😞',
      title: 'Superficial Swiping',
      description: 'Appearance bias prevents genuine connections. You\'re more than your profile photo.',
    },
    {
      icon: '💬',
      title: 'Conversations Go Nowhere',
      description: 'Text messaging reveals nothing about chemistry. How many "Hey" messages have you sent?',
    },
    {
      icon: '⏰',
      title: 'Hours Wasted on Bad Dates',
      description: 'Meet in person only to discover zero chemistry. You could\'ve known in 10 minutes.',
    },
  ];

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
          Why Traditional Dating Apps Fail
        </h2>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-primary)',
                borderRadius: '16px',
                padding: '40px 32px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              className="hover:border-[var(--border-secondary)]"
            >
              {/* Icon */}
              <div style={{
                fontSize: '64px',
                marginBottom: '24px',
              }}>
                {problem.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: 600,
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}>
                {problem.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'var(--text-tertiary)',
              }}>
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
