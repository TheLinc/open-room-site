import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Footer, GetStarted, OpenSource, Safety } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { copy, links } from "@/lib/copy";
import { getDownloadUrl, getStars } from "@/lib/github";

export default async function Page() {
  const [stars, download] = await Promise.all([getStars(), getDownloadUrl()]);

  // What search engines are told the page is about: a free Windows app.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: copy.siteName,
    description: copy.description,
    url: links.site,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows",
    downloadUrl: download,
    softwareHelp: links.github,
    license: "https://opensource.org/license/mit",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
