"use client";

import React from "react";
import Link from "next/link";
import {
  PawPrint,
  Heart,
  ShieldCheck,
  Clock,
  Award,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Phone,
  Sparkles,
  Building2,
  Users,
  Target,
  Microscope,
  Activity,
} from "lucide-react";

// ─── DATA: STATS ──────────────────────────────────────────────────────────────
const ABOUT_STATS = [
  { value: "15,000+", label: "Verified Pets Treated", sub: "Since 2014 across North India" },
  { value: "14+ Years", label: "Clinical Heritage", sub: "Dedicated multi-specialty hospital" },
  { value: "24/7/365", label: "Emergency Response", sub: "Continuous ICU & trauma standby" },
  { value: "99.6%", label: "Clinical Success Rate", sub: "Across complex surgeries & ICU" },
];

// ─── DATA: TIMELINE ───────────────────────────────────────────────────────────
const MILESTONES = [
  {
    year: "2014",
    title: "Founding in Kota",
    desc: "DogPet Clinic was established by Dr. Arjun Sharma with a modest 2-consulting room setup and an uncompromised vision: bringing human-grade medical standards to veterinary practice.",
  },
  {
    year: "2016",
    title: "Automated Laboratory & Digital Imaging",
    desc: "Inaugurated our in-house automated hematology analyzer and high-frequency digital X-ray suite, reducing critical diagnostic turnaround times from 24 hours to just 20 minutes.",
  },
  {
    year: "2018",
    title: "24/7 Trauma ICU & Ambulance Fleet",
    desc: "Commissioned a dedicated 24-hour critical care intensive care unit (ICU) and launched Kota's first fully equipped mobile pet ambulance for acute trauma and poisoning cases.",
  },
  {
    year: "2020",
    title: "Advanced Orthopedic & Laparoscopy Wing",
    desc: "Expanded into specialized orthopedic fracture repairs, cruciate ligament reconstructions, and minimally invasive diagnostic endoscopy with zero-infection sterile protocols.",
  },
  {
    year: "2022",
    title: "Community Outreach & Stray Rescue Program",
    desc: "Launched our subsidized spay/neuter foundation and annual anti-rabies drive, providing free vaccinations to over 3,500 community animals.",
  },
  {
    year: "2024+",
    title: "Digital Healthcare Portal & 15k Milestone",
    desc: "Celebrated treating over 15,000 pets and rolled out our digitized electronic health records (EHR) portal, allowing pet owners to access vaccine charts and lab results anywhere.",
  },
];

// ─── DATA: CORE VALUES ────────────────────────────────────────────────────────
const CLINICAL_VALUES = [
  {
    icon: Heart,
    title: "Patient-First Compassion",
    desc: "We practice Fear-Free veterinary handling methods. Low voices, treats, non-slip surfaces, and calming pheromones are utilized to eliminate anxiety for dogs and cats.",
  },
  {
    icon: ShieldCheck,
    title: "Absolute Clinical Transparency",
    desc: "No unnecessary treatments, hidden fees, or ambiguous diagnoses. We explain every test result, surgical requirement, and cost breakdown clearly before beginning care.",
  },
  {
    icon: Microscope,
    title: "Evidence-Based Medicine",
    desc: "Our treatment guidelines adhere strictly to the World Small Animal Veterinary Association (WSAVA) and Veterinary Council of India (VCI) clinical protocols.",
  },
  {
    icon: Activity,
    title: "Unbroken 24/7 Readiness",
    desc: "Critical illness does not keep business hours. Our trauma team, oxygen supplies, and sterile surgical suites are fully staffed and operable at any hour of the night.",
  },
];

// ─── DATA: INFRASTRUCTURE HIGHLIGHTS ──────────────────────────────────────────
const INFRASTRUCTURE = [
  {
    title: "HEPA-Filtered Positive-Pressure Surgical Suite",
    desc: "Hospital-grade sterile airflow prevents airborne microbes from entering the operating field, ensuring near-zero surgical infection rates.",
  },
  {
    title: "Central Medical Oxygen Pipeline & ICU Cages",
    desc: "Direct pipeline oxygen delivery to every ICU recovery bay and surgical monitoring station, ensuring immediate emergency respiratory stabilization.",
  },
  {
    title: "Separate Feline & Canine Waiting Lounges",
    desc: "Dedicated waiting and recovery bays to prevent dog barking from causing acute sensory stress to feline patients.",
  },
  {
    title: "Digital High-Frequency X-Ray & 4D Doppler Ultrasound",
    desc: "Superior tissue differentiation for detecting tumors, fractures, urinary calculi, and cardiac anomalies with minimal radiation exposure.",
  },
];

// ─── DATA: FACULTY ────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    name: "Dr. Arjun Sharma",
    degree: "BVSc & AH, MVSc (Surgery & Radiology)",
    role: "Chief Veterinary Surgeon & Medical Director",
    experience: "14+ Years Clinical Experience",
    image: "/doctors/doctor-1.jpg",
    bio: "Pioneered advanced orthopedic plating and soft-tissue surgical procedures in Rajasthan. Has performed over 4,500 complex animal surgeries with a focus on cruciate repair and oncology.",
  },
  {
    name: "Dr. Priya Mehra",
    degree: "BVSc & AH, MVSc (Veterinary Medicine)",
    role: "Senior Consultant – Dermatology & Internal Medicine",
    experience: "10+ Years Clinical Experience",
    image: "/doctors/doctor-2.jpg",
    bio: "Specializes in chronic allergic skin diseases, endocrine disorders, and immune-mediated conditions. Renowned for resolving multi-year chronic dermatitis cases in dogs and cats.",
  },
  {
    name: "Dr. Rohan Kapoor",
    degree: "BVSc & AH, PG Dip. Emergency Critical Care",
    role: "Head of Emergency & Critical Care (ICU)",
    experience: "8+ Years Emergency Experience",
    image: "/doctors/doctor-3.jpg",
    bio: "Expert in golden-hour trauma triage, poison antidotes, and intensive care hemodynamics. Oversees our 24/7 critical resuscitation unit and mobile pet ambulance dispatch.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#9999ff] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#9999ff]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-zinc-200 text-zinc-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#9999ff] animate-pulse" />
              <span>Established 2014 • Kota, Rajasthan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
              Pioneering Modern Veterinary Healthcare With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-[#9999ff] to-[#9999ff]">
                Heart &amp; Science.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
              DogPet Clinic was founded on a simple truth: our animal companions deserve the exact same level of diagnostic precision, surgical mastery, and compassionate care as human family members.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link href="/services">
                <button className="px-8 py-3.5 rounded-full font-bold text-xs bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all cursor-pointer">
                  Explore Our Clinical Services
                </button>
              </Link>
              <a href="tel:+911234567890">
                <button className="px-7 py-3.5 rounded-full font-semibold text-xs border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-[#9999ff]" />
                  <span>Call Hospital Reception</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS STRIP (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {ABOUT_STATS.map((s, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs font-bold text-[#9999ff] uppercase tracking-wider">
                  {s.label}
                </div>
                <div className="text-[11px] text-zinc-500 font-medium">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OUR STORY & CLINICAL PHILOSOPHY (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
                <Sparkles className="w-3.5 h-3.5" />
                Our Story
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                From a Compassionate Vision to Kota&apos;s Foremost Animal Hospital.
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                When Dr. Arjun Sharma founded DogPet Clinic in 2014, pet parents across Rajasthan frequently had to travel hundreds of kilometers to metropolitan cities for routine procedures like orthopedic plating, blood transfusions, or emergency trauma management.
              </p>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Determined to eliminate this gap, DogPet invested relentlessly in cutting-edge medical infrastructure: from sterile positive-pressure surgical theaters to automated pathology analyzers and a continuous 24/7 ICU triage desk.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-700">
                    <strong className="text-zinc-950">Strict VCI Clinical Protocols:</strong> Every procedure is performed strictly according to certified veterinary regulations.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-700">
                    <strong className="text-zinc-950">Fear-Free Environment:</strong> Low-stress consultation protocols designed specifically to ease nervous pets.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-700">
                    <strong className="text-zinc-950">100% Upfront Estimates:</strong> Itemized medical billing with zero surprises or hidden clinical fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="rounded-3xl p-8 bg-zinc-50 border border-zinc-200 shadow-sm relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 pb-6 border-b border-zinc-200">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-[#9999ff] shadow-2xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-950">DogPet Medical Complex</h3>
                    <p className="text-xs text-zinc-500 font-medium">Kota City, Rajasthan, India</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
                    <div className="text-2xl font-black text-zinc-950">4</div>
                    <div className="text-[11px] text-zinc-500 font-medium mt-1">Specialized Consultation Suites</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
                    <div className="text-2xl font-black text-[#9999ff]">2</div>
                    <div className="text-[11px] text-zinc-500 font-medium mt-1">HEPA Sterile Operating Rooms</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
                    <div className="text-2xl font-black text-zinc-950">12</div>
                    <div className="text-[11px] text-zinc-500 font-medium mt-1">Oxygen ICU Patient Beds</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
                    <div className="text-2xl font-black text-zinc-950">24/7</div>
                    <div className="text-[11px] text-zinc-500 font-medium mt-1">On-Site Emergency Dispatch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OUR CORE CLINICAL VALUES (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Target className="w-3.5 h-3.5" />
              Our Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              The Four Pillars of DogPet Practice
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Every veterinarian, surgical nurse, and receptionist on our team is guided by these non-negotiable principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLINICAL_VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl p-6 bg-white border border-zinc-200 hover:border-[#9999ff]/40 hover:shadow-lg transition-all duration-300 space-y-4 shadow-2xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-[#9999ff]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-950">{v.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HISTORICAL TIMELINE (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Clock className="w-3.5 h-3.5" />
              Decade of Progress
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              A Decade of Veterinary Milestones
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Explore how continuous medical investment has turned DogPet Clinic into a benchmark of animal healthcare.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {MILESTONES.map((m, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:border-zinc-300 transition-all shadow-2xs"
              >
                <div className="px-4 py-2 rounded-2xl bg-white border border-zinc-200 text-lg font-black text-[#9999ff] shrink-0 shadow-2xs">
                  {m.year}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-950">{m.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOSPITAL INFRASTRUCTURE & BIO-SAFETY (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Clinical Bio-Safety
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Hospital Infrastructure Built for Pet Safety
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Nosocomial (hospital-acquired) infections are a critical risk in veterinary clinics. Here is how our sterile facility mitigates that risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {INFRASTRUCTURE.map((item, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 bg-white border border-zinc-200 hover:border-zinc-300 transition-all space-y-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#9999ff]" />
                  <h3 className="text-sm font-bold text-zinc-950">{item.title}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed pl-5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DOCTOR PROFILES (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Users className="w-3.5 h-3.5" />
              Board of Doctors
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Meet Our Senior Clinical Leadership
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Dedicated surgeons, dermatologists, and critical care specialists bringing decades of combined experience to your pet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DOCTORS.map((doc, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-[#9999ff]/40 transition-all duration-300 flex flex-col group shadow-2xs"
              >
                <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-lg font-bold text-white drop-shadow-sm">{doc.name}</h3>
                    <p className="text-xs text-rose-300 font-semibold drop-shadow-sm">{doc.role}</p>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-500 font-medium">{doc.degree}</p>
                    <p className="text-xs text-zinc-600 leading-relaxed">{doc.bio}</p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#9999ff]" />
                      {doc.experience}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HEROUI CALL TO ACTION BANNER (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Experience the DogPet Difference Today.
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Book a routine wellness examination, speak with a veterinary specialist, or drop by our hospital. Your pet will be treated like family.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link href="/sign-in">
                <button className="px-8 py-3.5 rounded-full font-bold text-xs bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all cursor-pointer">
                  Book Patient Appointment
                </button>
              </Link>
              <Link href="/services">
                <button className="px-7 py-3.5 rounded-full font-semibold text-xs border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 active:scale-95 transition-all cursor-pointer shadow-2xs">
                  Browse Clinical Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
