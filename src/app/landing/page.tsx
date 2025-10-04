import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import ProblemStatement from '@/components/landing/ProblemStatement';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import TrustSafety from '@/components/landing/TrustSafety';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import Events from '@/components/landing/Events';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Sticky Header */}
      <Header />

      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: Problem Statement */}
      <ProblemStatement />

      {/* Section 3: How It Works */}
      <HowItWorks />

      {/* Section 4: Features Showcase */}
      <Features />

      {/* Section 5: Trust & Safety */}
      <TrustSafety />

      {/* Section 6: Testimonials */}
      <Testimonials />

      {/* Section 7: Pricing */}
      <Pricing />

      {/* Section 8: Events & Community */}
      <Events />

      {/* Section 9: Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
