import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import DietsPreview from "@/components/home/diets-preview";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <DietsPreview />
      {/* <TestimonialsSection /> */}
      <CTASection />
    </>
  );
}