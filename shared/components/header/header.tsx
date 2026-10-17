"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
];

export default function Header() {
  const path = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Hide on auth & dashboard routes
  if (
    path.startsWith("/sign") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/verify")
  ) {
    return null;
  }

  const { data: session } = authClient.useSession();

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-200 text-zinc-900 shadow-xs">
      {/* Top micro emergency banner - Light Theme */}
      <div className="bg-zinc-100/90 border-b border-zinc-200/80 py-1.5 px-4 text-[11px] font-medium text-zinc-600">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9999ff] animate-pulse" />
            <span className="text-zinc-900 font-semibold">24/7 Trauma &amp; Emergency Care</span>
            <span className="hidden sm:inline text-zinc-500">• In-House ICU &amp; Surgery Ready</span>
          </div>
          <a
            href="tel:+911234567890"
            className="flex items-center gap-1.5 text-zinc-700 hover:text-[#9999ff] transition-colors font-medium"
          >
            <Phone className="w-3 h-3 text-[#9999ff]" />
            <span>Emergency Dispatch: +91 12345 67890</span>
          </a>
        </div>
      </div>

      <header className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="DogPet Clinic"
                width={110}
                height={38}
                className="object-contain"
                priority
              />
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#9999ff]" />
            </div>
          </Link>

          {/* Desktop Navigation Links — HeroUI Light Pill Style */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    active
                      ? "bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/25"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Hotline & HeroUI Auth Button */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+911234567890"
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 border border-zinc-200 text-zinc-700 hover:border-[#9999ff]/50 hover:text-[#9999ff] transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#9999ff] animate-pulse" />
              <span>24/7 Helpline</span>
            </a>

            {/* HeroUI CTA Button */}
            <div className="hidden sm:block">
              {!session?.user ? (
                <Link href="/sign-in">
                  <button className="relative inline-flex items-center justify-center gap-2 rounded-full font-semibold text-xs tracking-wide px-5 py-2.5 bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 hover:shadow-lg hover:shadow-[#9999ff]/35 active:scale-95 transition-all duration-200 cursor-pointer">
                    <span>Book Appointment</span>
                  </button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <button className="relative inline-flex items-center justify-center gap-2 rounded-full font-semibold text-xs tracking-wide px-5 py-2.5 bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 hover:shadow-lg hover:shadow-[#9999ff]/35 active:scale-95 transition-all duration-200 cursor-pointer">
                    <span>Dashboard</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-full"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 bg-white border-l border-zinc-200 text-zinc-900 p-6 pt-10"
                >
                  {/* Brand inside drawer */}
                  <div className="mb-8 flex items-center justify-between pb-4 border-b border-zinc-200">
                    <Image
                      src="/logo.svg"
                      alt="DogPet Clinic"
                      width={100}
                      height={34}
                      className="object-contain"
                    />
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
                      24/7 Care
                    </span>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2">
                    {NAV_LINKS.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setSheetOpen(false)}
                          className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                            active
                              ? "bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20"
                              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Emergency & Auth */}
                  <div className="mt-8 pt-6 border-t border-zinc-200 space-y-3">
                    <a
                      href="tel:+911234567890"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-semibold bg-zinc-100 border border-zinc-200 text-zinc-800"
                    >
                      <Phone className="w-4 h-4 text-[#9999ff]" />
                      <span>Call Vet: +91 12345 67890</span>
                    </a>

                    {!session?.user ? (
                      <Link href="/sign-in" onClick={() => setSheetOpen(false)}>
                        <button className="w-full py-3.5 rounded-full font-bold text-xs bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/25 active:scale-95 transition-all">
                          Book Appointment
                        </button>
                      </Link>
                    ) : (
                      <Link href="/dashboard" onClick={() => setSheetOpen(false)}>
                        <button className="w-full py-3.5 rounded-full font-bold text-xs bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/25 active:scale-95 transition-all">
                          Open Dashboard
                        </button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
