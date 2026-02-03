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
    default: "DogPet Clinic – Trusted Veterinary Care for Your Pets",
    template: "%s | DogPet Clinic",
  },
  description:
    "DogPet Clinic provides professional veterinary services for dogs and pets. Book appointments, vaccinations, health checkups, grooming, and emergency care with trusted vets.",
  keywords: [
    "dog clinic",
    "pet clinic",
    "veterinary clinic",
    "dog hospital",
    "pet hospital",
    "veterinary services India",
    "DogPet Clinic",
  ],
  authors: [{ name: "DogPet Clinic Team" }],
  creator: "DogPet Clinic",
  publisher: "DogPet Clinic",
  metadataBase: new URL("https://dogpetclinic.com"),

  openGraph: {
    title: "DogPet Clinic – Trusted Veterinary Care for Your Pets",
    description:
      "Compassionate and professional veterinary care for dogs and pets. DogPet Clinic offers checkups, vaccinations, grooming, and emergency services.",
    url: "https://dogpetclinic.com",
    siteName: "DogPet Clinic",
    images: [
      {
        url: "https://i.ibb.co/hFtY1kN8/favicon.jpg",
        width: 1200,
        height: 630,
        alt: "DogPet Clinic Veterinary Services",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "DogPet Clinic – Trusted Veterinary Care for Your Pets",
    description:
      "Quality veterinary care for dogs and pets. Book appointments and services easily with DogPet Clinic.",
    images: ["https://i.ibb.co/hFtY1kN8/favicon.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://dogpetclinic.com",
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
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        {children}
        <Footer />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
