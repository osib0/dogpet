"use client";

import React from "react";
import {
  Stethoscope,
  Syringe,
  Ambulance,
  Scissors,
  Bone,
  Microscope,
  HeartPulse,
  PawPrint,
  ArrowRight,
} from "lucide-react";

const SERVICES = [
  {
    icon: Stethoscope,
    title: "General Health Checkups",
    desc: "Routine physical examinations to monitor your pet’s overall health and detect problems early.",
  },
  {
    icon: Syringe,
    title: "Vaccination & Preventive Care",
    desc: "Complete vaccination schedules and preventive treatments to protect pets from diseases.",
  },
  {
    icon: HeartPulse,
    title: "Emergency & Critical Care",
    desc: "Immediate medical attention for accidents, sudden illness, and life-threatening conditions.",
  },
  {
    icon: Bone,
    title: "Surgery & Treatment",
    desc: "Safe surgical procedures performed by experienced veterinarians using modern equipment.",
  },
  {
    icon: Scissors,
    title: "Grooming & Hygiene",
    desc: "Professional grooming services to keep your pet clean, comfortable, and healthy.",
  },
  {
    icon: Microscope,
    title: "Diagnostics & Lab Tests",
    desc: "Advanced diagnostic services including blood tests, X-rays, and health screenings.",
  },
  {
    icon: PawPrint,
    title: "Nutrition & Diet Consultation",
    desc: "Personalized diet plans and nutrition advice based on your pet’s age and condition.",
  },
  {
    icon: Ambulance,
    title: "24/7 Emergency Support",
    desc: "Round-the-clock emergency assistance to ensure your pet gets care when it matters most.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-28 bg-linear-to-b from-[#f6fefb] to-white">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 mb-3 px-4 py-1 text-xs font-semibold rounded-full bg-[#e9fbf3] text-[#2fbf8f]">
            Our Services
          </span>

          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Complete Veterinary Care for{" "}
            <span className="text-[#72e3ad]">Every Pet</span>
          </h2>

          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            From routine checkups to emergency treatments, DogPet Clinic offers
            comprehensive veterinary services designed to keep your pets healthy,
            happy, and safe at every stage of life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl p-px
                bg-linear-to-br from-[#72e3ad]/40 to-transparent
                hover:from-[#72e3ad] transition-all duration-300"
              >
                <div
                  className="h-full bg-white rounded-2xl p-6
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:shadow-xl"
                >
                  {/* Icon */}
                  <div className="relative mb-5">
                    <div
                      className="w-14 h-14 rounded-xl bg-[#e9fbf3]
                      flex items-center justify-center
                      transition-all duration-300
                      group-hover:bg-[#72e3ad]"
                    >
                      <Icon className="w-7 h-7 text-[#72e3ad] group-hover:text-white transition-colors" />
                    </div>

                    {/* glow */}
                    <div className="absolute inset-0 rounded-xl blur-xl bg-[#72e3ad]/20 opacity-0 group-hover:opacity-100 transition" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  {/* <div className="flex items-center gap-2 text-xs font-medium text-[#72e3ad]">
                    Learn more
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
