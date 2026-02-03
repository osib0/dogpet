"use client";

import React from "react";
import { Search, CalendarCheck, Stethoscope, HeartHandshake } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Choose a Service",
    desc: "Select the veterinary service your pet needs — checkups, vaccination, grooming, or emergency care.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Book Appointment",
    desc: "Pick a convenient date and time to schedule your visit with our experienced vets.",
  },
  {
    step: "03",
    icon: Stethoscope,
    title: "Visit the Clinic",
    desc: "Bring your pet to our clean and pet-friendly clinic for professional examination and treatment.",
  },
  {
    step: "04",
    icon: HeartHandshake,
    title: "Ongoing Care & Support",
    desc: "Get digital prescriptions, follow-up care, and continuous support for your pet’s health.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block mb-3 text-xs font-semibold tracking-wider uppercase text-[#72e3ad]">
            How It Works
          </span>

          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Simple Steps to Get the{" "}
            <span className="text-[#72e3ad]">Best Care</span> for Your Pet
          </h2>

          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Booking an appointment at DogPet Clinic is quick and easy.
            Just follow these simple steps and let us take care of your pet.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-[#f6fefb] rounded-2xl p-6 text-center
                border border-transparent hover:border-[#72e3ad]
                transition-all duration-300"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-6 bg-[#72e3ad] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 mx-auto rounded-full bg-white shadow flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-[#72e3ad]" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
