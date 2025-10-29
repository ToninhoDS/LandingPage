
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AIStylesSection from '@/components/AIStylesSection';
import BookingSection from '@/components/BookingSection';
import ReviewsSection from '@/components/ReviewsSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <AIStylesSection />
      <BookingSection />
      <ReviewsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
