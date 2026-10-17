"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Linkedin, Youtube, MapPin, Phone, Mail, PawPrint } from "lucide-react";
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
    <footer style={{ background: "#0f172a" }} className="border-t border-white/10">
      <div className="container mx-auto px-6 py-14">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image src="logo.svg" alt="DogPet Clinic Logo" width={110} height={40} className="brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              DogPet Clinic provides compassionate, reliable, and modern
              veterinary care — treating every pet like family, every single day.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
                { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
                { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 hover:text-[#34d399]"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
                { href: "/sign-in", label: "Book Appointment" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[#34d399]">
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">Contact</h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                DogPet Clinic, Kota City, India
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                <a href="tel:+911234567890" className="hover:text-[#34d399] transition-colors">
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#34d399" }} />
                <a href="mailto:care@dogpetclinic.com" className="hover:text-[#34d399] transition-colors">
                  care@dogpetclinic.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Bottom */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <PawPrint className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
            <span>© {new Date().getFullYear()} DogPet Clinic. All rights reserved.</span>
          </div>
          <div className="flex gap-5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <Link href="/privacy-policy" className="hover:text-[#34d399] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#34d399] transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
