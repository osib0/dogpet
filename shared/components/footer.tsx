"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const path = usePathname();

  if (
    path.startsWith("/sign") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/verify")
  ) {
    return null;
  }

  return (
    <footer className="bg-[#f6fefb] border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4 h-10 -translate-x-12 -translate-y-12">
              <Image src="/logo.svg" alt="DogPet Clinic" width={150} height={100} />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              DogPet Clinic provides compassionate, reliable, and modern
              veterinary care to keep your pets healthy and happy.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex justify-end">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Contact Information
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#72e3ad] mt-1" />
                DogPet Clinic, Kota City, India
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#72e3ad] mt-1" />
                <a href="tel:+911234567890" className="hover:text-[#72e3ad]">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#72e3ad] mt-1" />
                <a
                  href="mailto:care@dogpetclinic.com"
                  className="hover:text-[#72e3ad]"
                >
                  care@dogpetclinic.com
                </a>
              </li>
            </ul>
          </div>
          </div>

          {/* Social */}
          <div className="flex justify-end">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4 text-gray-500">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="hover:text-[#72e3ad]"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-[#72e3ad]"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-[#72e3ad]"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy-policy" className="hover:text-[#72e3ad]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#72e3ad]">
              Terms & Conditions
            </Link>
          </div>

          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} DogPet Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
