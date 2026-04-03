"use client";

import { LayoutDashboard, Users, ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ===================== MENU ===================== //

export const menu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    icon: Users,
    submenu: [
      { title: "Add Patient", url: "/dashboard/patient/add" },
      { title: "Patient List", url: "/dashboard/patient/list" },
    ],
  },
];

// ===================== SIDEBAR ===================== //

export function AppSidebar() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<string>("");

  const { isMobile, setOpenMobile } = useSidebar();

  const mobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  // 🔥 auto open submenu if active
  useEffect(() => {
    menu.forEach((item, index) => {
      if (item.submenu) {
        item.submenu.forEach((sub) => {
          if (sub.url === pathname) {
            setActiveIndex(`item-${index}`);
          }
        });
      }
    });
  }, [pathname]);

  return (
    <Sidebar className="py-4 flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 pb-4 flex items-center">
        <Link href="/" className="block no-underline">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </Link>
      </div>

      <SidebarContent className="mt-2">
        <SidebarGroup>
          <Accordion
            type="single"
            collapsible
            value={activeIndex}
            onValueChange={setActiveIndex}
          >
            {menu.map((item, index) => {
              const isSubmenu = !!item.submenu;

              // ================= SIMPLE LINK =================
              if (!isSubmenu) {
                return (
                  <Link
                    key={index}
                    href={item.url!}
                    onClick={mobileSidebar}
                    className={`flex items-center gap-2 text-[13px] font-medium py-2 px-3 rounded-md no-underline transition-all ${
                      pathname === item.url
                        ? "bg-[#f2f2f2] text-black"
                        : "text-[#737373] hover:bg-[#f5f5f5] hover:text-black"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              }

              // ================= SUBMENU =================
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-0"
                >
                  <AccordionTrigger
                    className={`flex items-center justify-between text-[13px] font-medium py-2 px-3 rounded-md no-underline transition-all [&>svg]:hidden ${
                      activeIndex === `item-${index}`
                        ? "bg-[#f2f2f2]"
                        : "hover:bg-[#f5f5f5]"
                    }`}
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="no-underline">{item.title}</span>
                    </div>

                    {/* ONLY ONE ARROW */}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeIndex === `item-${index}` ? "rotate-180" : ""
                      }`}
                    />
                  </AccordionTrigger>

                  {/* SUBMENU ITEMS */}
                  <AccordionContent className="mt-1">
                    <div className="flex flex-col gap-1">
                      {item.submenu.map((subItem, i) => (
                        <Link
                          key={i}
                          href={subItem.url}
                          onClick={mobileSidebar}
                          className={`flex items-center text-[12px] py-2 px-3 ml-6 rounded-md no-underline transition-all ${
                            pathname === subItem.url
                              ? "bg-[#e9e9e9] text-black font-medium"
                              : "text-[#737373] hover:bg-[#f5f5f5] hover:text-black"
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
