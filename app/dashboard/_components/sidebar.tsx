"use client";

import { LayoutDashboard, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarGroupLabel,
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
    title: "Users & Roles",
    icon: Users,
    submenu: [
      { title: "User List", url: "/dashboard/user/list" },
      { title: "Add User", url: "/dashboard/user/add" },
      { title: "Roles & Permissions", url: "/dashboard/user/permissions" },
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
    <Sidebar className="py-4 flex flex-col justify-between h-full">
      
      {/* Logo */}
      <div className="px-5 pb-4 flex items-center">
        <Link href="/" className="no-underline">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </Link>
      </div>

      <SidebarContent className="mt-5">
        <SidebarGroup>

          <Accordion
            type="single"
            collapsible
            value={activeIndex}
            onValueChange={setActiveIndex}
          >
            {menu.map((item, index) => {
              const isSubmenu = !!item.submenu;

              // ================= DASHBOARD =================
              if (!isSubmenu) {
                return (
                  <Link
                    key={index}
                    href={item.url!}
                    onClick={mobileSidebar}
                    className={`flex items-center gap-2 text-[13px] font-medium py-2 px-3 rounded-md no-underline transition-colors hover:bg-[#f2f2f2] ${
                      pathname === item.url ? "bg-[#f2f2f2]" : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
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
                    className={`flex items-center gap-2 text-[13px] font-medium py-2 px-3 rounded-md no-underline hover:bg-[#f2f2f2] ${
                      activeIndex === `item-${index}`
                        ? "bg-[#f2f2f2]"
                        : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </AccordionTrigger>

                  <AccordionContent className="pl-6">
                    {item.submenu.map((subItem, i) => (
                      <SidebarMenu key={i}>
                        <SidebarGroupLabel
                          className={`block px-3 py-2 rounded-md text-[12px] no-underline hover:text-black ${
                            pathname === subItem.url
                              ? "text-black font-medium"
                              : ""
                          }`}
                        >
                          <Link
                            href={subItem.url}
                            onClick={mobileSidebar}
                            className="no-underline w-full block"
                          >
                            {subItem.title}
                          </Link>
                        </SidebarGroupLabel>
                      </SidebarMenu>
                    ))}
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