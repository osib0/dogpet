"use client";

import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactSection() {
    return (
        <section className="py-28 bg-[#f0fdf4]">
            <div className="container mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="inline-block mb-3 text-xs font-semibold tracking-wider uppercase text-[#34d399]">
                        Contact Us
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                        Get in Touch with <span className="text-[#34d399]">DogPet Clinic</span>
                    </h2>
                    <p className="text-sm text-gray-600">
                        Have questions or need urgent help for your pet? We’re always here
                        to help with compassionate care.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
                    {/* Left Info */}
                    <div className="space-y-5">
                        {[
                            {
                                icon: MapPin,
                                title: "Clinic Address",
                                value: "DogPet Clinic, Kota City, India",
                            },
                            {
                                icon: Phone,
                                title: "Phone Number",
                                value: "+91 12345 67890",
                                href: "tel:+911234567890",
                            },
                            {
                                icon: Mail,
                                title: "Email Address",
                                value: "care@dogpetclinic.com",
                                href: "mailto:care@dogpetclinic.com",
                            },
                            {
                                icon: Clock,
                                title: "Working Hours",
                                value: "Mon – Sun: 9:00 AM – 9:00 PM",
                            },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 rounded-2xl
                  border border-gray-200 bg-white px-5 py-4"
                                >
                                    <Icon className="w-6 h-6 text-[#34d399] mt-1" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
                                            {item.title}
                                        </h4>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="text-sm text-[#34d399] font-medium"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-600">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Form */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Send Us a Message
                        </h3>

                        <form className="space-y-4">
                            <Input
                                placeholder="Your Name"
                                className="border-gray-300 focus:border-[#34d399] focus:ring-[#34d399]"
                            />
                            <Input
                                type="email"
                                placeholder="Email Address"
                                className="border-gray-300 focus:border-[#34d399] focus:ring-[#34d399]"
                            />
                            <Input
                                placeholder="Phone Number"
                                className="border-gray-300 focus:border-[#34d399] focus:ring-[#34d399]"
                            />
                            <Textarea
                                placeholder="How can we help your pet?"
                                rows={4}
                                className="border-gray-300 focus:border-[#34d399] focus:ring-[#34d399]"
                            />

                            <Button size={'sm'} className="bg-gray-900 hover:bg-gray-700 text-white border-none shadow-sm rounded-full px-6 text-sm font-medium cursor-pointer">
                                Submit Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
