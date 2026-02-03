"use client";

import React from "react";
import { Stethoscope, Award } from "lucide-react";

const DOCTORS = [
  {
    name: "Dr. Ananya Sharma",
    role: "Senior Veterinary Surgeon",
    experience: "12+ Years Experience",
    specialization: "Surgery & Emergency Care",
    image: "/doctors/doctor-1.jpg", 
  },
  {
    name: "Dr. Rahul Verma",
    role: "Veterinary Physician",
    experience: "8+ Years Experience",
    specialization: "General Checkups & Vaccination",
    image: "/doctors/doctor-2.jpg",
  },
  {
    name: "Dr. Neha Kapoor",
    role: "Pet Nutrition Specialist",
    experience: "6+ Years Experience",
    specialization: "Diet & Preventive Care",
    image: "/doctors/doctor-3.jpg",
  },
];

export default function DoctorsSection() {
  return (
    <section className="py-24 bg-[#f6fefb]">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-14">
          <span className="inline-block mb-3 text-xs font-semibold tracking-wider uppercase text-[#72e3ad]">
            Our Veterinary Experts
          </span>

          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
            Meet Our <span className="text-[#72e3ad]">Experienced Vets</span>
          </h2>

          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Our team of certified and compassionate veterinary doctors is dedicated
            to providing the highest quality care for your beloved pets.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DOCTORS.map((doc, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm
              hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {doc.name}
                </h3>
                <p className="text-sm text-[#72e3ad] font-medium">
                  {doc.role}
                </p>

                <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Award className="w-4 h-4 text-[#72e3ad]" />
                    {doc.experience}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#72e3ad]" />
                    {doc.specialization}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
