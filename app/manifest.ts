import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Komvos | Páginas Web y Automatización",
    short_name: "Komvos",
    description:
      "Diseño de páginas web profesionales y sistemas de automatización por WhatsApp para negocios.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#090D16",
    lang: "es-MX",
    icons: [
      {
        src: "/favicon-k.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-k.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
