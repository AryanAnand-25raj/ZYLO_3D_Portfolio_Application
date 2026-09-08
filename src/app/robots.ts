import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/builder/",
        "/api/",
        "/preview/",
        "/connect/",
        "/_next/",
      ],
    },
    sitemap: "https://zylo.design/sitemap.xml",
  };
}
