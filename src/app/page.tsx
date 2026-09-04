import { BeatSection } from "@/components/beat-section";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/copy";
import { sectionFrames } from "@/lib/room-frames";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      {copy.beats.map((beat, index) => (
        <BeatSection
          key={beat.id}
          id={beat.id}
          title={beat.title}
          body={beat.body}
          alt={beat.alt}
          image={sectionFrames[beat.id]}
          flip={index % 2 === 1}
        />
      ))}
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
