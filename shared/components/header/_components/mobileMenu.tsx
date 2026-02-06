"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NavigationMenuDemo } from "./menu";
import { X } from "lucide-react";
import Image from "next/image";
import menu from "@/assets/icons/menu.png";
import { useState } from "react";
import Link from "next/link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Drawer direction="top" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="pe-0">
            <Image src={menu} width={25} alt="menu" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-5 backdrop-blur-lg bg-white/70 rounded-none">
          <div className="flex  justify-between items-center">
            <Link href={"/"} className="overflow-hidden">
              <Image
                src={"logo.svg"}
                alt="logo"
                className="object-cover"
                width={100}
                height={100}
              />
            </Link>
            <div className="flex items-center">
              <DrawerTrigger>
                <X />
              </DrawerTrigger>
            </div>
          </div>
          <NavigationMenuDemo />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
