"use client";

import { Brain, Bell, FileText, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Smart Health Records",
    desc: "Your pet’s complete medical history stored securely and accessible anytime.",
  },
  {
    icon: Bell,
    title: "Appointment Reminders",
    desc: "Automatic reminders for vaccinations, checkups, and follow-ups.",
  },
  {
    icon: FileText,
    title: "Digital Prescriptions",
    desc: "Paperless prescriptions and reports for easy access and sharing.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "All pet data is protected with industry-standard security.",
  },
];

export default function SmartFeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Smart Features at <span className="text-[#72e3ad]">DogPet Clinic</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-[#f6fefb] rounded-2xl p-6 text-center">
                <Icon className="w-8 h-8 mx-auto text-[#72e3ad] mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
