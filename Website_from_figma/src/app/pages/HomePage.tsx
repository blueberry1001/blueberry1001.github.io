import { HeroSection } from "../components/HeroSection";
import { LinksSection } from "../components/LinksSection";
import { WorksSection } from "../components/WorksSection";
import { TimelineSection } from "../components/TimelineSection";
import { ArticlesSection } from "../components/ArticlesSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <LinksSection />
      <WorksSection />
      <TimelineSection />
      <ArticlesSection />
    </>
  );
}