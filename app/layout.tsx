import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Snippet",
  description:
    "Code Snippet - Create beautiful code screenshots for your presentations and social media. Easily customize, export, and share code images.",
  keywords: [
    "code snippet",
    "code image generator",
    "code screenshot",
    "code to image",
    "developer tools",
    "programming",
    "share code",
    "export code image",
  ],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Code Snippet",
    description:
      "Create beautiful code screenshots for your presentations and social media. Easily customize, export, and share code images.",
    url: process.env.SITE_URL || "",
    siteName: "Code Snippet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code Snippet",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Code Snippet",
              url: process.env.SITE_URL,
              description:
                "Code Snippet - Create beautiful code screenshots for your presentations and social media. Easily customize, export, and share code images.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Image
          src="/logo.svg"
          alt="Code Snippet Logo"
          width={1200}
          height={630}
          style={{ display: "none" }}
          priority
        />
        {children}
      </body>
    </html>
  );
}
