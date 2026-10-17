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
                <Button size={'sm'} className="bg-gray-900 hover:bg-gray-700 text-white border-none shadow-sm rounded-full px-6 text-sm font-medium cursor-pointer">
                    <PhoneCall className="w-4 h-4" /> Call Now
                </Button>
            </Link>
        </section>
    );
}
