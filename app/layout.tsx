import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import Header from "@/shared/components/header/header";
import Footer from "@/shared/components/footer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const Sorafont = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LibEase – Smart Library Management Software",
    template: "%s | LibEase",
  },
  description:
    "LibEase is a smart library management software for schools, colleges, and institutions in India. Manage books, students, issues, returns, and reports easily with LibEase.",
  keywords: [
    "library management software",
    "library software India",
    "school library management system",
    "college library software",
    "digital library management",
    "LibEase",
  ],
  authors: [{ name: "LibEase Team" }],
  creator: "LibEase",
  publisher: "LibEase",
  metadataBase: new URL("https://libease.co.in"),

  openGraph: {
    title: "LibEase – Smart Library Management Software",
    description:
      "Simplify your library operations with LibEase. A modern library management system built for Indian schools and institutions.",
    url: "https://libease.co.in",
    siteName: "LibEase",
    images: [
      {
        url: "https://i.ibb.co/hFtY1kN8/favicon.jpg", 
        width: 1200,
        height: 630,
        alt: "LibEase Library Management Software",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "LibEase – Smart Library Management Software",
    description:
      "Manage your library smarter with LibEase. Built for schools and colleges in India.",
    images: ["https://i.ibb.co/hFtY1kN8/favicon.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://libease.co.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Sorafont.variable} ${Sorafont.className} antialiased`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Header />
        {children}
        <Footer />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
