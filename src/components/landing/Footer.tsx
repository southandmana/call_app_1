import Link from 'next/link';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Events', href: '#events' },
      { name: 'Premium', href: '#pricing' },
      { name: 'Matcher AI', href: '#features' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press Kit', href: '/press' },
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community Guidelines', href: '/legal/guidelines' },
      { name: 'Safety Tips', href: '/help/safety' },
      { name: 'FAQs', href: '/help/faq' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/legal/terms' },
      { name: 'Privacy Policy', href: '/legal/privacy' },
      { name: 'Community Guidelines', href: '/legal/guidelines' },
      { name: 'Cookie Policy', href: '/legal/cookies' },
    ],
    social: [
      { name: 'Twitter', href: 'https://twitter.com/cqpduk', icon: '𝕏' },
      { name: 'Instagram', href: 'https://instagram.com/cqpduk', icon: '📷' },
      { name: 'TikTok', href: 'https://tiktok.com/@cqpduk', icon: '🎵' },
      { name: 'Discord', href: 'https://discord.gg/cqpduk', icon: '💬' },
    ],
  };

  return (
    <footer style={{
      background: '#1F2937',
      paddingTop: '60px',
      paddingBottom: '40px',
    }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12">
          {/* Logo Column */}
          <div className="md:col-span-1">
            <img
              src="/logo.svg"
              alt="CQPDUK"
              style={{
                height: '32px',
                width: 'auto',
                filter: 'invert(1) brightness(0.9)',
                marginBottom: '16px',
              }}
            />
            <p style={{
              fontSize: '14px',
              color: '#9CA3AF',
              lineHeight: 1.6,
            }}>
              Voice-first dating for authentic connections
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Product
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.product.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Company
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.company.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Resources
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.resources.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.legal.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    className="hover:text-[var(--accent)]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Connect
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {footerLinks.social.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    className="hover:text-[var(--accent)]"
                  >
                    <span>{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
          }}>
            © 2025 CQPDUK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
