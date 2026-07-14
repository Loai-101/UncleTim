import { setRequestLocale } from "next-intl/server";
import { CertificatesSection } from "@/components/certificates/CertificatesSection";
import { ContactCTA } from "@/components/contact/ContactCTA";
import { LegacyDashboard } from "@/components/dashboard/LegacyDashboard";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { HeroSection } from "@/components/hero/HeroSection";
import { SecondaryNavbar } from "@/components/layout/SecondaryNavbar";
import { NewspaperArchive } from "@/components/newspapers/NewspaperArchive";
import {
  RoyalConnectionsTeaser,
} from "@/components/storytelling/RoyalConnectionsTeaser";
import { StorytellingSection } from "@/components/storytelling/StorytellingSection";
import { LegacyTimeline } from "@/components/timeline/LegacyTimeline";
import { FeaturedSliderSection } from "@/features/featured-slider/components/FeaturedSliderSection";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Homepage composition — compact hero + secondary nav + featured slider,
 * then the archival narrative sections.
 * TODO Phase 2: Replace all placeholder datasets with verified content.
 */
export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <HeroSection />
      <SecondaryNavbar />
      <FeaturedSliderSection />
      <LegacyDashboard />
      <LegacyTimeline />
      <StorytellingSection />
      <PhotoGallery />
      <NewspaperArchive />
      <CertificatesSection />
      <RoyalConnectionsTeaser />
      <ContactCTA />
    </main>
  );
}
