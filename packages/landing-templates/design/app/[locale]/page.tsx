import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';

const LogoCloudSection = dynamic(() => import('@/components/sections/LogoCloudSection'), { ssr: true });
const FeaturesSection = dynamic(() => import('@/components/sections/FeaturesSection'), { ssr: true });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection'), { ssr: true });
const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), { ssr: true });
const IntegrationsSection = dynamic(() => import('@/components/sections/IntegrationsSection'), { ssr: true });
const TeamSection = dynamic(() => import('@/components/sections/TeamSection'), { ssr: true });
const AboutSection = dynamic(() => import('@/components/sections/AboutSection'), { ssr: true });
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: true });
const CTASection = dynamic(() => import('@/components/sections/CTASection'), { ssr: true });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: true });

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LogoCloudSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <IntegrationsSection />
      <TeamSection />
      <AboutSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
