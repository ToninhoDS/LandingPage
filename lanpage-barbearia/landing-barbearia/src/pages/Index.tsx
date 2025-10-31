
import React from 'react';
import Header from '@/components/Header';
import B2BHeroSection from '@/components/b2b/B2BHeroSection';
import ProblemSolutionSection from '@/components/b2b/ProblemSolutionSection';
import AppDemoSection from '@/components/b2b/AppDemoSection';
import ROICalculatorSection from '@/components/b2b/ROICalculatorSection';
import BusinessFeaturesSection from '@/components/b2b/BusinessFeaturesSection';
import IntegrationsSection from '@/components/b2b/IntegrationsSection';
import B2BTestimonialsSection from '@/components/b2b/B2BTestimonialsSection';
import B2BPricingSection from '@/components/b2b/B2BPricingSection';
import B2BCTASection from '@/components/b2b/B2BCTASection';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import { useLeadCapture } from '@/hooks/useLeadCapture';

const Index = () => {
  const { showModal, modalTrigger, closeModal } = useLeadCapture({
    autoShowDelay: 45000, // 45 segundos
    exitIntentEnabled: true,
    scrollPercentageThreshold: 60
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <B2BHeroSection />
      <ProblemSolutionSection />
      <AppDemoSection />
      <ROICalculatorSection />
      <BusinessFeaturesSection />
      <IntegrationsSection />
      <B2BTestimonialsSection />
      <B2BPricingSection />
      <B2BCTASection />
      <Footer />
      
      {/* Componentes de captura de leads */}
      <WhatsAppFloatingButton />
      <LeadCaptureModal
        isOpen={showModal}
        onClose={closeModal}
        trigger={modalTrigger}
      />
    </div>
  );
};

export default Index;
