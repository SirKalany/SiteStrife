import { Geist, Geist_Mono } from "next/font/google";
import { Chakra_Petch, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["700"],
  subsets: ["latin"],
});

const shareMono = Share_Tech_Mono({
  variable: "--font-sharetechmono",
  weight: ["400"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${chakra.variable} ${shareMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
