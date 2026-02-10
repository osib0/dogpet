"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { LogOut, Settings } from "lucide-react";
import AccountSettingsModal from "./account";
import { usePathname, useRouter } from "next/navigation";
import { links } from "./sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";



function DashboardHeader() {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const [heading, setHeading] = useState<string|undefined>(undefined);

  useEffect(() => {
    const title = getName();
    setHeading(title?.label);
  }, [pathName]);

  function getName() {
    return links.find((el) => el.href == pathName);
  }

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/sign-in");
  };

  return (
    <>
      <header className="bg-white flex sticky top-0 justify-between items-center p-3">
        <div className="flex items-center gap-2.5">
          <SidebarTrigger className="flex md:hidden"></SidebarTrigger>
          <h2 className="capitalize">{heading}</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex capitalize text-sm items-center gap-3 rounded-full hover:bg-slate-100 pl-3 pr-2 py-1.5 cursor-pointer">
            {session?.user?.name}
            <Avatar>
              <AvatarImage
                src={session?.user?.image || ""}
                alt="Hallie Richards"
              />
              <AvatarFallback className="shadow-none text-xs hover:bg-[#4fe09a] bg-[#72e3ad] uppercase border border-[#16b674bf] cursor-pointer">
                {session?.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem className="flex flex-col items-start ">
              {session?.user?.name}
              <p className="text-slate-500 text-xs">{session?.user?.email}</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px] cursor-pointer" onClick={() => setOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 text-[13px] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AccountSettingsModal open={open} onOpenChange={setOpen} />
      </header>
    </>
  );
}

export default DashboardHeader;
