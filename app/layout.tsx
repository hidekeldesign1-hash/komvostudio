import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { QuizModalProvider } from "@/components/ui/QuizModal";
import { BookingModalProvider } from "@/components/ui/BookingModal";
import { GlobalButtonWave } from "@/components/ui/GlobalButtonWave";

const SITE_URL = "https://www.komvos.com.mx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090D16",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Komvos | Diseño de Páginas Web Profesionales y Automatización para Negocios",
    template: "%s | Komvos",
  },
  description:
    "Creamos páginas web profesionales de alta conversión y conectamos automatizaciones por WhatsApp y Google Calendar. Ayudamos a negocios, clínicas, despachos y comercios a captar más clientes, responder dudas frecuentes y agendar citas 24/7 sin tareas manuales.",
  keywords: [
    "diseño de páginas web profesionales",
    "creador de páginas web para negocios",
    "hacer página web para mi empresa",
    "cuanto cuesta una página web profesional",
    "agencia de desarrollo web",
    "páginas web rápidas para negocios",
    "landing page de alta conversión",
    "automatización de whatsapp business",
    "chatbot para responder whatsapp",
    "agendamiento automático de citas",
    "conectar whatsapp con google calendar",
    "sistema de citas para clínicas",
    "automatizar respuestas en whatsapp",
    "cómo conseguir más clientes por internet",
    "páginas web para consultorios",
    "páginas web para restaurantes",
    "páginas web para despachos",
    "páginas web para inmobiliarias",
    "páginas web para escuelas",
    "páginas web para tiendas",
    "captación de prospectos por internet",
    "software de agendamiento para negocios",
    "integracion de whatsapp con calendario",
    "soluciones digitales para pymes",
    "desarrollo web en mexico",
  ],
  authors: [{ name: "Komvos Marketing Studio", url: SITE_URL }],
  creator: "Komvos Marketing Studio",
  publisher: "Komvos Marketing Studio",
  applicationName: "Komvos",
  category: "business",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-MX": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
    siteName: "Komvos",
    title: "Komvos | Diseño de Páginas Web Profesionales y Automatización para Negocios",
    description:
      "Creamos páginas web profesionales de alta conversión y conectamos automatizaciones por WhatsApp y Google Calendar. Ayudamos a negocios, clínicas, despachos y comercios a captar más clientes, responder dudas frecuentes y agendar citas 24/7 sin tareas manuales.",
    images: [
      {
        url: "/Hero-devices.png",
        width: 1200,
        height: 630,
        alt: "Komvos — páginas web profesionales y automatización para negocios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Komvos | Páginas Web Profesionales y Automatización",
    description:
      "Páginas web de alta conversión y automatización por WhatsApp + Google Calendar para negocios en México.",
    images: ["/Hero-devices.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon-k.png", type: "image/png" }],
    apple: [{ url: "/favicon-k.png", type: "image/png" }],
    shortcut: "/favicon-k.png",
  },
  manifest: "/manifest.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: "Komvos Marketing Studio",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon-k.png`,
      image: `${SITE_URL}/Hero-devices.png`,
      description:
        "Estudio digital especializado en el diseño de páginas web profesionales de alta conversión y sistemas de automatización de atención por WhatsApp y Google Calendar para todo tipo de negocios.",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MX",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
      knowsAbout: [
        "Diseño de Páginas Web Profesionales",
        "Automatización de WhatsApp Business",
        "Agendamiento Automático de Citas con Google Calendar",
        "Landing Pages de Alta Conversión",
        "Sistemas Digitales para Negocios",
        "Captación de Prospectos y Leads",
        "Optimización de Conversión UX/UI",
      ],
      areaServed: {
        "@type": "Country",
        name: "Mexico",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Komvos",
      description: "Páginas Web Profesionales y Automatización para Negocios",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "es-MX",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-web`,
      name: "Diseño y Desarrollo de Páginas Web Profesionales",
      provider: {
        "@id": `${SITE_URL}/#organization`,
      },
      serviceType: "Diseño Web",
      description:
        "Creación de sitios web modernos, rápidos, adaptados a celulares y enfocados en transformar visitantes en clientes reales.",
      areaServed: "MX",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-whatsapp`,
      name: "Automatización de WhatsApp y Agendamiento de Citas",
      provider: {
        "@id": `${SITE_URL}/#organization`,
      },
      serviceType: "Automatización de Procesos",
      description:
        "Sistemas de atención automática en WhatsApp que responden preguntas frecuentes, califican prospectos y coordinan agendas con Google Calendar sin intervención manual.",
      areaServed: "MX",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased text-[#1D1D1F]" suppressHydrationWarning>
        <BookingModalProvider>
          <QuizModalProvider>
            <GlobalButtonWave />
            <SiteHeader />
            <main className="pb-24 md:pb-0">{children}</main>
            <Footer />
          </QuizModalProvider>
        </BookingModalProvider>
      </body>
    </html>
  );
}
