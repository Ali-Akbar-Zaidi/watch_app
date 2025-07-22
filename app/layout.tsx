
import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico, Parisienne } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const parisienne = Parisienne({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-parisienne',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beguiling Chronos - Where Time Meets Elegance",
  description: "Luxury Watch Collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${parisienne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
