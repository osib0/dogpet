"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
];

function Header() {
  const path = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

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
    <div className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl shadow-sm">
      <header className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.svg"
              alt="DogPet Clinic"
              width={110}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white bg-[#34d399]"
                    : "text-gray-600 hover:text-[#059669] hover:bg-[#d1fae5]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Auth button + mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Auth Button — desktop */}
            <div className="hidden md:block">
              {!session?.user ? (
                <Link href="/sign-in">
                  <Button
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-700 text-white border-none shadow-sm rounded-full px-5 text-sm font-medium transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="bg-gray-900 hover:bg-gray-700 text-white border-none shadow-sm rounded-full px-5 text-sm font-medium transition-all duration-200"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-[#059669] hover:bg-[#d1fae5]"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-xl pt-10">
                  {/* Mobile Logo */}
                  <div className="mb-8 px-4">
                    <Image
                      src="/logo.svg"
                      alt="DogPet Clinic"
                      width={100}
                      height={36}
                      className="object-contain"
                    />
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col gap-1 px-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive(link.href)
                            ? "bg-[#34d399] text-white"
                            : "text-gray-600 hover:bg-[#d1fae5] hover:text-[#059669]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth Button */}
                  <div className="mt-6 px-4">
                    {!session?.user ? (
                      <Link href="/sign-in" onClick={() => setSheetOpen(false)}>
                        <Button className="w-full bg-gray-900 hover:bg-gray-700 text-white border-none shadow-sm rounded-full text-sm font-medium transition-all duration-200">
                          Login
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard" onClick={() => setSheetOpen(false)}>
                        <Button className="w-full bg-gray-900 hover:bg-gray-700 text-white border-none shadow-sm rounded-full text-sm font-medium transition-all duration-200">
                          Dashboard
                        </Button>
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

export default Header;
