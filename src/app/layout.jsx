import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "ReWear - Sustainable Fashion, Infinite Style",
  description: "Join the circular fashion revolution. Swap, share, and discover pre-loved clothing while earning points and reducing waste.",
  keywords: "sustainable fashion, clothing swap, circular economy, pre-loved clothing, fashion marketplace",
  authors: [{ name: "ReWear Team" }],
  openGraph: {
    title: "ReWear - Sustainable Fashion, Infinite Style",
    description: "Join the circular fashion revolution. Swap, share, and discover pre-loved clothing.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReWear - Sustainable Fashion, Infinite Style",
    description: "Join the circular fashion revolution. Swap, share, and discover pre-loved clothing.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}