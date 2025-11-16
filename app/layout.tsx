import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sealwright LLC - NYC Document Services at Albany Prices",
  description: "Professional document services including apostilles, LLC formation, FOIL requests, and registered agent services. Same-day processing, NYS licensed, 50-75% savings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
