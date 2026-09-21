import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Bytespider",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://www.komvos.com.mx/sitemap.xml",
    host: "https://www.komvos.com.mx",
  };
}
