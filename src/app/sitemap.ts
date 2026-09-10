import type { MetadataRoute } from "next";
import { links } from "@/lib/copy";

// One page. The date is the build's, which is when the content last
// changed, since every push to master deploys.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: links.site,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
