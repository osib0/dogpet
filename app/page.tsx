import AboutSection from "./_components/about";
import EmergencyCTASection from "./_components/cat";
import ContactSection from "./_components/contact";
import DoctorsSection from "./_components/doctor";
import FAQSection from "./_components/faq";
import SmartFeaturesSection from "./_components/feature";
import Hero from "./_components/hero";
import ServicesSection from "./_components/services";
import TestimonialsSection from "./_components/testimonial";
import TrustSection from "./_components/trust";
import WhyChooseUsSection from "./_components/whychoose";
import HowItWorksSection from "./_components/work";

export default function Home() {
  return (
    <div className="z-0">
      <Hero />
      <TrustSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <DoctorsSection />
      <TestimonialsSection />
      <EmergencyCTASection />
      <FAQSection />
      <ContactSection />
    </div>
  )
}
