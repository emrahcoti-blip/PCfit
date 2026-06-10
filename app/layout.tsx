import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCFit — AI PC Build Advisor | Know Exactly What to Buy",
  description:
    "Tell us your budget and the games you play. Get a complete, compatible PC parts list with prices and where to buy — in 30 seconds. Free AI build advisor.",
  metadataBase: new URL("https://pcfit.io"),
  openGraph: {
    title: "PCFit — AI PC Build Advisor",
    description:
      "Your budget + your games = a complete parts list. The step before PCPartPicker.",
    url: "https://pcfit.io",
    siteName: "PCFit",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PCFit — AI PC Build Advisor",
    description: "Your budget + your games = a complete parts list.",
  },
};

function Logo() {
  return (
    <svg className="mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="6" stroke="#22d3ee" strokeWidth="2.5" />
      <rect x="9" y="9" width="14" height="14" rx="2" fill="#22d3ee" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#0a0c10" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="inner">
            <a href="/" className="logo">
              <Logo />
              <span>
                PC<em>Fit</em>
              </span>
            </a>
            <nav className="nav-links">
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="inner">
            <div className="links">
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/disclosure">Affiliate Disclosure</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Use</a>
            </div>
            <p>
              © {new Date().getFullYear()} PCFit. Build recommendations are powered by AI —
              always double-check compatibility and current prices before purchase. As an Amazon
              Associate, PCFit earns from qualifying purchases.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
