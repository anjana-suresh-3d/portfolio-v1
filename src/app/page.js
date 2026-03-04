'use client';

import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutPreview from '@/components/sections/AboutPreview';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import ProjectsShowcase from '@/components/sections/ProjectsShowcase';
import ContactCTA from '@/components/sections/ContactCTA';
import Footer from '@/components/ui/Footer';
import { ContentProvider } from '@/hooks/useContent';
import NarrativeScroll from '@/components/ui/NarrativeScroll';

export default function HomePage() {
  return (
    <ContentProvider>
      <Navbar />
      <NarrativeScroll>
        <main>
          <HeroSection />
          <AboutPreview />
          <ServicesSection />
          <ProcessSection />
          <ProjectsShowcase />
          <ContactCTA />
        </main>
      </NarrativeScroll>
      <Footer />
    </ContentProvider>
  );
}
