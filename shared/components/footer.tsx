"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Twitter,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  PawPrint,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const path = usePathname();

  // Hide on auth & dashboard routes
  if (
    !path ||
    path.startsWith("/sign") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/verify")
  ) {
    return null;
  }

  return (
    <footer className="bg-zinc-50 text-zinc-900 border-t border-zinc-200 pt-16 pb-12">
      <div className="container mx-auto px-6">
        {/* Top Highlight Banner: 24/7 Veterinary Emergency — Light Theme */}
        <div className="mb-14 p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#9999ff]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9999ff] animate-pulse" />
                Emergency Triage Desk Active 24/7
              </div>
              <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                Immediate Critical &amp; Trauma Support For Your Pet
              </h3>
              <p className="text-zinc-600 text-sm max-w-xl">
                Our emergency trauma team and surgical theatre operate round-the-clock. Call our dispatch hotline for immediate triage advice or emergency transport.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-xs bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline: +91 12345 67890</span>
              </a>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-xs border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 transition-all active:scale-95"
              >
                <span>Book Non-Urgent Visit</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Col 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image
                src="/logo.svg"
                alt="DogPet Clinic"
                width={120}
                height={40}
                className="object-contain"
              />
              <span className="w-2 h-2 rounded-full bg-[#9999ff]" />
            </Link>
            <p className="text-sm text-zinc-600 leading-relaxed max-w-sm">
              DogPet Clinic is a premier, multi-specialty veterinary healthcare institution dedicated to providing compassionate, science-backed medical, surgical, and preventative care for pets across all life stages.
            </p>
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9999ff]" />
                VCI Registered Vets
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#9999ff]" />
                ISO Clean Facility
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-2 pt-2">
              {[
                { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
                { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
                { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-zinc-200 text-zinc-600 hover:text-[#9999ff] hover:border-[#9999ff]/50 hover:bg-[#9999ff]/5 transition-all shadow-2xs"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <Link href="/" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9999ff]" />
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9999ff]" />
                  About Clinic &amp; Team
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9999ff]" />
                  Clinical Services
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9999ff]" />
                  Patient Portal Login
                </Link>
              </li>
              <li>
                <Link href="/services#emergency" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#9999ff]" />
                  24/7 Emergency Protocol
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Specializations */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-4">
              Key Services
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors">
                  General Health &amp; Vitals
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors">
                  Vaccinations &amp; Deworming
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors">
                  Soft Tissue &amp; Ortho Surgery
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors">
                  Digital X-Ray &amp; Ultrasound
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors">
                  Hematology &amp; Biochemistry Lab
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-zinc-950 transition-colors">
                  Therapeutic Pet Grooming
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Hours */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-4">
              Clinic &amp; Contact
            </h4>
            <ul className="space-y-3 text-xs text-zinc-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                <span>DogPet Multi-Specialty Pet Hospital, Main Road, Kota, Rajasthan, India</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                <a href="tel:+911234567890" className="hover:text-zinc-950 transition-colors font-medium">
                  +91 12345 67890 (Emergency)
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                <a href="mailto:care@dogpetclinic.com" className="hover:text-zinc-950 transition-colors">
                  care@dogpetclinic.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-900 font-semibold">OPD: 8:00 AM - 9:00 PM</p>
                  <p className="text-[11px] text-[#9999ff] font-medium">Emergency: 24 Hours / 7 Days</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-200 mb-8" />

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-[#9999ff]" />
            <span>&copy; {new Date().getFullYear()} DogPet Clinic. All rights reserved. Licensed Veterinary Practice.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-zinc-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-800 transition-colors">
              Terms of Treatment
            </Link>
            <Link href="/services" className="hover:text-zinc-800 transition-colors">
              Emergency Protocol
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
