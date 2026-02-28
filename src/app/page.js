'use client';

import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutPreview from '@/components/sections/AboutPreview';
import ProjectsShowcase from '@/components/sections/ProjectsShowcase';
import ServicesSection from '@/components/sections/ServicesSection';
import ContactCTA from '@/components/sections/ContactCTA';
import Footer from '@/components/ui/Footer';
import { ContentProvider } from '@/hooks/useContent';

export default function HomePage() {
  return (
    <ContentProvider>
      <Navbar />
      <main>
        <HeroSection />
        <AboutPreview />
        <ProjectsShowcase />
        <ServicesSection />
        <ContactCTA />
      </main>
      <Footer />
    </ContentProvider>
  );
}
