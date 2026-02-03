"use client";

import { CheckCircle } from "lucide-react";

const POINTS = [
  "Experienced & certified veterinary doctors",
  "Pet-friendly and hygienic clinic environment",
  "Affordable and transparent pricing",
  "24/7 emergency care support",
  "Modern medical equipment",
  "Compassionate treatment for every pet",
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-[#f6fefb]">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Why Choose <span className="text-[#72e3ad]">DogPet Clinic</span>
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {POINTS.map((p, i) => (
            <li key={i} className="flex gap-3 items-start">
              <CheckCircle className="w-5 h-5 text-[#72e3ad] mt-1" />
              <span className="text-sm text-gray-700">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
