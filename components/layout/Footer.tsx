"use client";

import { useBookingModal } from "@/components/ui/BookingModal";

const FACEBOOK_URL = "https://www.facebook.com/share/17q76MhVy4/?mibextid=wwXIfr";

export function Footer() {
  const year = new Date().getFullYear();
  const { openBooking } = useBookingModal();

  return (
    <footer className="border-t border-border bg-black py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center pb-6 sm:pb-8">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_20px_-4px_var(--accent-glow)] backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:bg-white/15 hover:shadow-[0_0_28px_-2px_var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 sm:h-12 sm:w-12"
            aria-label="Komvos en Facebook"
          >
            <svg
              className="h-5 w-5 text-foreground sm:h-6 sm:w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center sm:flex-row sm:gap-6 sm:pt-8 sm:text-left">
          <p className="text-xs text-foreground sm:text-sm" suppressHydrationWarning>
            © {year} Komvos Marketing Studio. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-foreground sm:gap-8 sm:text-sm">
            <button
              type="button"
              onClick={openBooking}
              className="transition-colors hover:text-cyan-300"
            >
              Agendar llamada
            </button>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacidad
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
