import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Footer, GetStarted, OpenSource, Safety } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { getStars } from "@/lib/github";

export default async function Page() {
  const stars = await getStars();
  return (
    <>
      <SiteHeader stars={stars} />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <OpenSource stars={stars} />
        <Safety />
        <GetStarted />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
