import { HeroSection } from '../features/home/HeroSection.jsx';
import { AeoCheckerSection } from '../features/aeo-checker/AeoCheckerSection.jsx';
import { PlatformStrip } from '../features/home/PlatformStrip.jsx';
import { ProblemSection } from '../features/home/ProblemSection.jsx';
import { ServicesSection } from '../features/home/ServicesSection.jsx';
import { ProcessSection } from '../features/home/ProcessSection.jsx';
import { AuditSection } from '../features/home/AuditSection.jsx';
import { IndustriesSection } from '../features/home/IndustriesSection.jsx';
import { WhyChooseUsSection } from '../features/home/WhyChooseUsSection.jsx';
import { InsightsSection } from '../features/home/InsightsSection.jsx';
import { FAQSection } from '../features/home/FAQSection.jsx';
import { CTASection } from '../components/common/CTASection.jsx';
import { WhatsAppEnquiry } from '../components/common/WhatsAppEnquiry.jsx';

export function Home() {
  return (
    <>
      <HeroSection />
      <PlatformStrip />
      <AeoCheckerSection />
      <ProblemSection />
      <ServicesSection />
      <ProcessSection />
      <AuditSection />
      <IndustriesSection />
      <WhyChooseUsSection />
      <InsightsSection />
      <FAQSection />
      <CTASection />
      <WhatsAppEnquiry />
    </>
  );
}
