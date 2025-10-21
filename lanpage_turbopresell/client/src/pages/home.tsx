import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import AdvancedFeatures from "@/components/advanced-features";
import Statistics from "@/components/statistics";
import Testimonials from "@/components/testimonials";
import PricingSection from "@/components/pricing-section";
import CallToAction from "@/components/call-to-action";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AdvancedFeatures />
      <Statistics />
      <Testimonials />
      <PricingSection />
      <CallToAction />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;
