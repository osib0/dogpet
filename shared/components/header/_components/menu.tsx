"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const MENU = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Our Vets", href: "/vets" },
  { name: "Appointments", href: "/appointments" },
  { name: "Contact", href: "/contact" },
];

export function NavigationMenuDemo() {
  const path = usePathname();

  return (
    <NavigationMenu className="mx-auto" viewport={false}>
      <NavigationMenuList className="flex flex-col md:flex-row gap-1 w-screen md:w-auto items-start md:items-center mt-4 md:mt-0">
        {MENU.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              asChild
              className={`hover:bg-transparent hover:text-[#72e3ad] ${
                path === item.href ? "text-[#72e3ad]" : ""
              }`}
            >
              <span className="flex w-screen md:w-auto px-0 md:px-2">
                <Link
                  href={item.href}
                  className="flex justify-between items-center text-sm font-medium w-full"
                >
                  {item.name}
                  <ChevronRight className="md:hidden me-10" />
                </Link>
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
