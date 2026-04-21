"use client";

import { LayoutDashboard, Users, ChevronDown, Package, Lock } from "lucide-react";

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
  {
    title: "Medications",
    icon: Package,
    submenu: [
      { title: "Add Medication", url: "/dashboard/medication/add" },
      { title: "Medication List", url: "/dashboard/medication/list" },
    ],
  },
  {
    title: "Modules",
    icon: Package,
    submenu: [
      { title: "Add Module", url: "/dashboard/modules/add" },
      { title: "Module List", url: "/dashboard/modules/list" },
    ],
  },
  {
    title: "Users",
    icon: Users,
    submenu: [
      { title: "Add User", url: "/dashboard/user/add" },
      { title: "User List", url: "/dashboard/user/list" },
    ],
  },
  {
    title: "Roles",
    icon: Lock,
    submenu: [
      { title: "Add Role", url: "/dashboard/roles/add" },
      { title: "Role List", url: "/dashboard/roles/list" },
    ],
  },
  {
    title: "Actions",
    icon: Package,
    submenu: [
      { title: "Add Action", url: "/dashboard/actions/add" },
      { title: "Action List", url: "/dashboard/actions/list" },
    ],
  },
  {
    title: "Permissions",
    url: "/dashboard/user/permissions",
    icon: Users,
  },
];

// ===================== SIDEBAR ===================== //

export function AppSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<string>("");
  const [allowedModules, setAllowedModules] = useState<string[]>([]);
  const [filteredMenu, setFilteredMenu] = useState(menu);

  const { isMobile, setOpenMobile } = useSidebar();

  const mobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  useEffect(() => {
    if (userEmail) {
      fetch(`/api/auth/me/permissions?email=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.modules.length > 0) {
            // For now, let's say 'Admin' module grants all, or they filter exactly
            // To prevent blocking everything if not set up, we could just filter if data.modules exist
            const modules = data.modules.map((m: string) => m.toLowerCase());
            // This is a simple implementation. In a real scenario, map menu titles to module page_names.
            // Let's assume Dashboard is always visible.
            const newMenu = menu.filter(m => 
              m.title === "Dashboard" || modules.includes(m.title.toLowerCase())
            );
            // If they have any roles set up, apply filter, otherwise show all to avoid breaking dev
            if (modules.length > 0) {
                setFilteredMenu(newMenu);
            }
          }
        })
        .catch(console.error);
    }
  }, [userEmail]);

  // 🔥 auto open submenu if active
  useEffect(() => {
    filteredMenu.forEach((item, index) => {
      if (item.submenu) {
        item.submenu.forEach((sub) => {
          if (sub.url === pathname) {
            setActiveIndex(`item-${index}`);
          }
        });
      }
    });
  }, [pathname, filteredMenu]);

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
            {filteredMenu.map((item, index) => {
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
