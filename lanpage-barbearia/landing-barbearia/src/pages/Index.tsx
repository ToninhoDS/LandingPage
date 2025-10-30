
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import AIStylesSection from '@/components/AIStylesSection';
import GallerySection from '@/components/GallerySection';
import BookingSection from '@/components/BookingSection';
import WhatsAppBookingForm from '@/components/WhatsAppBookingForm';
import ReviewsSection from '@/components/ReviewsSection';
import PricingSection from '@/components/PricingSection';
import LocationSection from '@/components/LocationSection';
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
      <HeroSection />
      <AboutSection />
      <AIStylesSection />
      <GallerySection />
      <BookingSection />
      <WhatsAppBookingForm />
      <ReviewsSection />
      <PricingSection />
      <LocationSection />
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
