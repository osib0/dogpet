"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PawPrint,
  Heart,
  ShieldCheck,
  Clock,
  Users,
  Award,
  Stethoscope,
  Leaf,
  ArrowRight,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Sparkles,
  Target,
  Eye,
} from "lucide-react";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
// Primary green: #34d399 (emerald-400) — richer, more premium
// Dark green:    #059669 (emerald-600)
// Light green:   #d1fae5 (emerald-100)
// BG tint:       #f0fdf4 (emerald-50)

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: PawPrint, value: "5,000+", label: "Happy Pets Treated", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  { icon: ShieldCheck, value: "10+", label: "Years of Experience", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  { icon: Clock, value: "24/7", label: "Emergency Support", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { icon: Heart, value: "100%", label: "Pet-Focused Care", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

const HIGHLIGHTS = [
  "Compassionate, pet-first approach to every treatment",
  "Certified & experienced veterinary professionals",
  "State-of-the-art diagnostic & surgical equipment",
  "Clean, calm, and pet-friendly clinic environment",
  "Transparent treatment plans & affordable pricing",
  "Emergency care available 24 hours a day, 7 days a week",
];

const TEAM = [
  {
    name: "Dr. Arjun Sharma",
    role: "Chief Veterinarian",
    exp: "12 Years Experience",
    img: "/doctors/doctor-1.jpg",
    spec: "Surgery & Critical Care",
  },
  {
    name: "Dr. Priya Mehra",
    role: "Pet Dermatologist",
    exp: "8 Years Experience",
    img: "/doctors/doctor-2.jpg",
    spec: "Skin & Coat Specialist",
  },
  {
    name: "Dr. Rohan Kapoor",
    role: "General Practitioner",
    exp: "6 Years Experience",
    img: "/doctors/doctor-3.jpg",
    spec: "Vaccination & Wellness",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "Compassion",
    desc: "Every pet deserves to be treated with the same love and care as a family member. We approach every case with empathy and kindness.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Integrity",
    desc: "We believe in complete transparency with pet parents — honest diagnoses, fair pricing, and clear communication at every step.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
  {
    icon: Target,
    title: "Excellence",
    desc: "From diagnostics to treatment, we maintain the highest standards of veterinary medicine using modern equipment and best practices.",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    icon: Leaf,
    title: "Well-being First",
    desc: "We prioritize the physical, mental, and emotional well-being of every pet — not just treating illness, but promoting lifelong health.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
];

const MILESTONES = [
  { year: "2014", event: "DogPet Clinic founded with a small team of 2 dedicated vets." },
  { year: "2016", event: "Expanded services to include advanced diagnostics and surgery." },
  { year: "2018", event: "Launched 24/7 emergency care and pet ambulance service." },
  { year: "2020", event: "Reached milestone of 2,000+ happy pet families served." },
  { year: "2022", event: "Opened a modern grooming & wellness center in our clinic." },
  { year: "2024", event: "Celebrated 10 years and 5,000+ pets treated with excellence." },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
      style={{ background: "rgba(52,211,153,0.12)", color: "#059669", border: "1.5px solid rgba(52,211,153,0.3)" }}>
      <Sparkles className="w-3 h-3" />
      {children}
    </span>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #ecfdf5 100%)" }}>
        {/* Blobs */}
        <div className="absolute w-[600px] h-[600px] rounded-full -top-48 -left-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full -bottom-24 -right-24 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />

        {/* Floating paws */}
        <div className="absolute top-12 left-12 opacity-20 animate-bounce" style={{ animationDuration: "4s" }}>
          <PawPrint className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="absolute bottom-12 right-12 opacity-15 animate-bounce" style={{ animationDelay: "1s", animationDuration: "5s" }}>
          <PawPrint className="w-8 h-8 text-emerald-500" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionPill>About DogPet Clinic</SectionPill>

          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Caring for Pets Like{" "}
            <span className="relative" style={{ color: "#34d399" }}>
              Family
              <span className="absolute bottom-1 left-0 right-0 h-1 rounded-full opacity-50"
                style={{ background: "linear-gradient(90deg, #34d399, #059669)" }} />
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            For over a decade, DogPet Clinic has been the most trusted name in compassionate
            veterinary care — treating every pet with the love and expertise they deserve.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #34d399, #059669)", boxShadow: "0 8px 32px rgba(52,211,153,0.35)" }}>
              Our Services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="tel:+911234567890"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm border-2 bg-white transition-all hover:-translate-y-1"
              style={{ borderColor: "#34d399", color: "#059669" }}>
              <Phone className="w-4 h-4" /> Call Us Now
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                    style={{ background: s.bg }}>
                    <Icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STORY
      ══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "linear-gradient(160deg, #f8fffe 0%, #fefce8 50%, #f0fdf9 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

            {/* Left */}
            <div>
              <SectionPill>Our Story</SectionPill>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">
                A Decade of{" "}
                <span style={{ color: "#34d399" }}>Dedicated Care</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-base">
                DogPet Clinic was founded in 2014 with a simple but powerful belief — pets deserve the
                same quality of medical care as humans. What started as a small 2-vet clinic has grown
                into one of India's most trusted veterinary centers, serving over 5,000 pet families.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Every decision we make — from investing in advanced equipment to hiring the most
                compassionate vets — is driven by our commitment to giving every pet the healthiest,
                happiest life possible.
              </p>

              {/* Highlights */}
              <ul className="space-y-3 mb-8">
                {HIGHLIGHTS.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#34d399" }} />
                    {h}
                  </li>
                ))}
              </ul>

              <Link href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #34d399, #059669)", boxShadow: "0 8px 32px rgba(52,211,153,0.3)" }}>
                Explore Our Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 rounded-full" style={{ background: "linear-gradient(180deg, #34d399, #d1fae5)" }} />
              <div className="space-y-8 pl-14">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="relative group">
                    {/* Dot */}
                    <div className="absolute -left-9 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}>
                      {i + 1}
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                      <div className="text-xs font-bold mb-1" style={{ color: "#34d399" }}>{m.year}</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OUR VALUES
      ══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0c1932 100%)" }}>
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1.5px solid rgba(52,211,153,0.3)" }}>
              <Sparkles className="w-3 h-3" />Our Values
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
              What We Stand For
            </h2>
            <p className="text-gray-400 text-base">
              Our core values guide everything we do — from how we treat patients to how we communicate with pet parents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="group relative rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${v.color}18, transparent 70%)` }} />
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                    style={{ background: v.bg }}>
                    <Icon className="w-7 h-7" style={{ color: v.color }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-3 relative z-10">{v.title}</h3>
                  <p className="text-sm leading-relaxed relative z-10" style={{ color: "rgba(255,255,255,0.5)" }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MEET THE TEAM
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionPill>Our Experts</SectionPill>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Meet the <span style={{ color: "#34d399" }}>Team</span>
            </h2>
            <p className="text-gray-500 text-base">
              Our certified, compassionate veterinary professionals bring years of experience and genuine love for animals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TEAM.map((doc, i) => (
              <div key={i} className="group rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img src={doc.img} alt={doc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
                  {/* Spec badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}>
                    {doc.spec}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-lg font-bold text-white">{doc.name}</div>
                    <div className="text-xs text-white/80">{doc.role}</div>
                  </div>
                </div>
                {/* Body */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Award className="w-4 h-4" style={{ color: "#34d399" }} />
                    {doc.exp}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VISION & MISSION
      ══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Mission */}
            <div className="rounded-3xl p-8 bg-white border-2 hover:-translate-y-1 transition-transform"
              style={{ borderColor: "rgba(52,211,153,0.3)", boxShadow: "0 8px 40px rgba(52,211,153,0.1)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "rgba(52,211,153,0.12)" }}>
                <Target className="w-7 h-7" style={{ color: "#34d399" }} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide every pet with compassionate, reliable, and evidence-based veterinary care —
                creating a world where no pet goes untreated due to lack of access to quality healthcare.
                We strive to be the most trusted partner for pet families across India.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl p-8 text-white hover:-translate-y-1 transition-transform"
              style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "rgba(52,211,153,0.15)" }}>
                <Eye className="w-7 h-7" style={{ color: "#34d399" }} />
              </div>
              <h3 className="text-xl font-black mb-4">Our Vision</h3>
              <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                To be India's most loved veterinary clinic — a place where pets feel safe, pet parents
                feel heard, and every treatment is delivered with the highest standards of modern
                veterinary science combined with genuine, heartfelt care.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)" }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Ready to Give Your Pet the Best Care?
            </h2>
            <p className="text-emerald-200 mb-10 text-base">
              Book an appointment today or call us for immediate assistance. We're here for your pet, always.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/sign-in"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ color: "#059669" }}>
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="tel:+911234567890"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border-2 border-white/30 text-white bg-white/10 transition-all hover:-translate-y-1 hover:bg-white/20">
                <Phone className="w-4 h-4" /> +91 12345 67890
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
