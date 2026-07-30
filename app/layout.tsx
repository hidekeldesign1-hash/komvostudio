import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuizModalProvider } from "@/components/ui/QuizModal";
import { GlobalButtonWave } from "@/components/ui/GlobalButtonWave";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: "Komvos Marketing Studio",
  description:
    "Creamos páginas web y soluciones digitales para que tu negocio se vea bien y consiga más clientes.",
  icons: {
    icon: "/favicon-k.png",
    apple: "/favicon-k.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased font-sans" suppressHydrationWarning>
        <QuizModalProvider>
          <GlobalButtonWave />
          <Navbar />
          <main className="pb-24 md:pb-0">{children}</main>
          <Footer />
        </QuizModalProvider>
      </body>
    </html>
  );
}
