import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import EnquiryDrawer from "../components/EnquiryDrawer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lakshmi Agency | Explore For Catalog and Price List",
  description: "Order Now on whatsapp 63610 33361",
  keywords: "Lakshmi Agency, Sulibele, Hoskote, Bangalore Rural, building materials, paints, hardware, PVC pipes, JK cement, waterproofing, bathroom fittings, price list",
  openGraph: {
    title: "Lakshmi Agency | Explore For Catalog and Price List",
    description: "Order Now on whatsapp 63610 33361",
    type: "website",
    locale: "en_IN",
    siteName: "Lakshmi Agency",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col transition-colors duration-300`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
          <EnquiryDrawer />
        </Providers>
      </body>
    </html>
  );
}
