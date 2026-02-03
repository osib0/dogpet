"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencyCTASection() {
    return (
        <section className="py-20 bg-gray-50 text-center">
            <h2 className="text-3xl font-semibold mb-4">
                Pet Emergency? We’re Here 24/7
            </h2>
            <p className="text-sm mb-6">
                Immediate care when your pet needs it the most.
            </p>
            <Link href="tel:+911234567890">
                <Button variant={'outline'} size={'sm'} className="shadow-none text-xs hover:bg-[#4fe09a] bg-[#72e3ad] border border-[#16b674bf] cursor-pointer">
                    <PhoneCall className="w-4 h-4" /> Call Now
                </Button>
            </Link>
        </section>
    );
}
