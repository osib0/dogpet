"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";


function Header() {
  const path = usePathname();

  if (path.startsWith("/sign") || path.startsWith("/dashboard") || path.startsWith("/verify")) {
    return null;
  }

  const { data: session } = authClient.useSession();

  return (
    <div className="border-b z-20 sticky top-0">
      <header className="container mx-auto">
        <div className="flex w-full mx-auto h-14  justify-between items-center py-2 backdrop-blur ">
          <Link href={"/"} className="overflow-hidden">
            <Image src={'logo.svg'} alt="logo" className="object-cover" width={100} height={100} />
          </Link>
          {/* <div className="hidden md:flex">
            <NavigationMenuDemo />
          </div> */}
          <div className="flex items-center w-24 justify-end">
            {!session?.user ? (
              <Link href={"/sign-in"}>
                <Button variant={'outline'} size={'sm'} className="shadow-none text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
                  Login
                </Button>
              </Link>
            ) : (
              <Link href={"/dashboard"}>
                <Button variant={'outline'} size={'sm'} className="shadow-none text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
                  Dashboard
                </Button>
              </Link>
            )}

            {/* <MobileMenu /> */}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
