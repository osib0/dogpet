"use client";

import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
gsap.registerPlugin(MotionPathPlugin);

const Hero = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="w-screen relative overflow-hidden">
      <div className=" container">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20 text-center relative z-10">
          <h1 className="text-3xl lg:text-6xl font-semibold tracking-tight mb-4 text-gray-900 leading-[1.3]">
            Smart Care for Your Pets with{" "}
             <span className="text-[#72e3ad]">DogPet Clinic</span>
          </h1>

          <p className="mb-8 max-w-3xl mx-auto">
            A modern dog & pet clinic platform to manage health records,
            appointments, and expert veterinary care — all in one place.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href={session?.user ? "/dashboard" : "/sign-in"}>
                <Button variant={'outline'} size={'sm'} className="shadow-none text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">

                  Book Appointment
                </Button>
              </Link>

              <Button variant={'outline'} size={'sm'} className="text-xs border cursor-pointer">
                Talk to Vet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
