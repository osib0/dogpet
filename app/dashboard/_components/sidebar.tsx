"use client";

import {
  Book,
  Layers,
  LayoutDashboard,
  CreditCard,
  Building,
  Settings,
  FileText,
  Users,
  Calendar,
  Settings2,
  Banknote,
  PawPrint,
  Stethoscope,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import ProfileMenu from "./profile";
// import ProfileMenu from "./profile";
// ===================== MENU CONFIG ===================== //

const menuItem = [
  {
    title: "Users & Roles",
    icon: Users,
    roles: ["SuperAdmin", "Admin"],
    submenu: [
      { title: "User List", url: "/dashboard/user/list" },
      { title: "Add User", url: "/dashboard/user/add" },
      { title: "Roles & Permissions", url: "/dashboard/user/permissions" },
    ],
  },
  {
    title: "Books Management",
    icon: Book,
    roles: ["SuperAdmin", "Admin", "UserAdmin"],
    submenu: [
      { title: "Book List", url: "#" },
      { title: "Add Book", url: "#" },
      { title: "Issue Book", url: "#" },
      { title: "Return Book", url: "#" },
    ],
  },
  {
    title: "Catalogs",
    icon: Layers,
    roles: ["SuperAdmin", "Admin"],
    submenu: [
      { title: "Category List", url: "#" },
      { title: "Add Category", url: "#" },
    ],
  },
  {
    title: "Subscriptions",
    icon: CreditCard,
    roles: ["SuperAdmin", "Admin"],
    submenu: [
      { title: "Plans", url: "#" },
      { title: "Active Subscriptions", url: "#" },
      { title: "Renewals", url: "#" },
    ],
  },
  {
    title: "Payments & Invoices",
    icon: FileText,
    roles: ["SuperAdmin", "Admin"],
    submenu: [
      { title: "Transaction History", url: "#" },
      { title: "Invoices", url: "#" },
    ],
  },
  {
    title: "Branches",
    icon: Building,
    roles: ["SuperAdmin"],
    submenu: [
      { title: "Branch List", url: "#" },
      { title: "Add Branch", url: "#" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    roles: ["SuperAdmin", "Admin", "UserAdmin"],
    submenu: [
      { title: "Profile Settings", url: "#" },
      { title: "System Settings", url: "#" },
    ],
  },
];

export const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/patient/add",
    label: "Patient",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/appoinment",
    label: "Appoinment",
    icon: Calendar,
  },
  {
    href: "/dashboard/pets",
    label: "Pets",
    icon: PawPrint,
  },
  {
    href: "/dashboard/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: Banknote,
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: ChartNoAxesColumnIncreasing,
  },
  // {
  //   href: "/dashboard/settings",
  //   label: "Settings",
  //   icon: Settings2,
  // },
];

// ===================== SIDEBAR COMPONENT ===================== //

export function AppSidebar() {
  const pathname = usePathname();
  const [isActive, setActive] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<string>();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const mobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  useEffect(() => {
    menuItem.forEach((ele, ind) => {
      ele.submenu.forEach((ell) => {
        if (ell.url == pathname) {
          console.log(ele.title, "sdsad");
          setActive(ele.title);
          setActiveIndex(`item-${ind}`);
          console.log(ind);
        }
        if (pathname == "/dashboard") {
          setActive("");
        }
      });
    });
  }, [pathname]);

  function handleValueChange(value: string) {
    setActiveIndex(value);
  }

  return (
    <Sidebar className="py-4  flex flex-col justify-between  h-full">
      <div className="px-5 h-13 pb-4 flex items-center">
        <Link href={"/"} className="overflow-hidden">
          <Image
            src={"logo.svg"}
            alt="logo"
            className="object-cover"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <SidebarContent className="mt-5">
        {/* APPLICATION MENU */}
        <SidebarGroup>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={mobileSidebar}
              className={`flex items-center gap-2 text-[#737373] text-[13px] font-medium py-2 px-3 rounded-md transition-colors hover:bg-[#f2f2f2] ${
                pathname === href ? "bg-[#f2f2f2]" : ""
              }`}
            >
              <Icon className="w-4 h-4 text-[#737373]" />
              {label}
            </Link>
          ))}

          {/* <Accordion onValueChange={handleValueChange} collapsible type="single" value={activeIndex}>
            {menuItem.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                <AccordionTrigger className={`decoration-0 ${isActive == item.title ? 'bg-[#f2f2f2]' : ''} hover:no-underline py-2 px-3 text-[#737373]  text-[13px] hover:bg-[#f2f2f2] rounded-md font-normal flex items-center w-full`}>
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-[#737373]" />
                    {item.title}
                  </div>

                </AccordionTrigger>

                {item.submenu && (
                  <AccordionContent className="pb-0 justify-start">
                    {item.submenu.map((subItem, ind) => (
                      <SidebarMenu
                        key={ind}
                        className="text-[#737373] text-[12px] flex  items-center  transition-colors"
                      >
                        <SidebarGroupLabel className={` w-[200px] text-start ms-5 px-3 py-2 rounded-md hover:text-zinc-950 ${subItem.url==pathname?'text-zinc-950':''}`}><Link className="w-full" href={subItem.url}>{subItem.title}</Link></SidebarGroupLabel>
                      </SidebarMenu>
                    ))}
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion> */}
        </SidebarGroup>
      </SidebarContent>
      {/* Profile */}
      {/* <ProfileMenu /> */}
    </Sidebar>
  );
}
