import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Footer, GetStarted, OpenSource, Safety } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { getDownloadUrl, getStars } from "@/lib/github";

export default async function Page() {
  const [stars, download] = await Promise.all([getStars(), getDownloadUrl()]);
  return (
    <>
      <SiteHeader stars={stars} download={download} />
      <main className="flex-1">
        <Hero download={download} />
        <HowItWorks />
        <Features />
        <OpenSource stars={stars} />
        <Safety />
        <GetStarted download={download} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
