"use client";

import React, { useState } from "react";
import { Clock, Heart, PawPrint, ShieldCheck, Stethoscope } from "lucide-react";
import { set } from "mongoose";


const STATS = [
  {
    icon: PawPrint,
    value: "5k+",
    label: "Happy Pet Parents",
  },
  {
    icon: ShieldCheck,
    value: "10+",
    label: "Years of Experience",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Emergency Support",
  },
  {
    icon: Heart,
    value: "100%",
    label: "Pet-Focused Care",
  },
];


export default function AboutSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-[#72e3ad]">
              About DogPet Clinic
            </span>

            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6 leading-tight">
              Caring for Pets Like Family —{" "}
              <span className="text-[#72e3ad]">Every Single Day</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              At <strong>DogPet Clinic</strong>, we believe pets are not just animals —
              they are family. Our mission is to provide compassionate, reliable,
              and modern veterinary care that keeps your pets healthy, happy,
              and safe throughout every stage of their life.
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              From routine checkups and vaccinations to emergency treatments,
              our experienced veterinary team is committed to delivering the
              highest standard of care in a calm, clean, and pet-friendly
              environment.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Compassionate Care
                  </h4>
                  <p className="text-xs text-gray-600">
                    Gentle and loving treatment for every pet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Trusted Clinic
                  </h4>
                  <p className="text-xs text-gray-600">
                    Certified vets & modern medical practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Expert Team
                  </h4>
                  <p className="text-xs text-gray-600">
                    Years of experience in pet healthcare.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual / Stats */}
          <div className="relative">
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-[#72e3ad]/10 blur-3xl rounded-full -z-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              {STATS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`group bg-white rounded-2xl p-6 shadow
              border
              hover:border-[#72e3ad]
              hover:shadow-none
              transition-all duration-300 h-full ${hoveredIndex === index ? 'shadow-none border-[#72e3ad]' : ''}`}
                    onMouseOver={() => setHoveredIndex(index)}
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#e9fbf3] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#72e3ad]" />
                      </div>
                    </div>
                    {/* Value */}
                    <h3 className="text-3xl font-semibold text-[#72e3ad]">
                      {item.value}
                    </h3>

                    {/* Label */}
                    <p className="text-xs text-gray-600 mt-1">
                      {item.label}
                    </p>

                    {/* Accent line */}
                    <div className={`${hoveredIndex === index ? 'w-14' : 'w-8'} mt-4 h-0.5 w-8 bg-[#72e3ad] mx-auto rounded-full opacity-60 group-hover:w-14 transition-all duration-300`} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
