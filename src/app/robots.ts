import type { MetadataRoute } from "next";
import { links } from "@/lib/copy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${links.site}/sitemap.xml`,
  };
}
