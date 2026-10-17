"use client";

import React, { useState } from "react";
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
  Activity,
  AlertCircle,
  Microscope,
  Scissors,
  Syringe,
  ChevronDown,
  Building2,
  Star,
  Flame,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ─── DATA: CLINICAL SERVICES ──────────────────────────────────────────────────
const CLINICAL_SERVICES = [
  {
    icon: Stethoscope,
    title: "Comprehensive Wellness & Physical Triage",
    desc: "Multi-point diagnostic examination covering cardiovascular, pulmonary, ocular, orthopedic, and neurological systems to detect silent illnesses early.",
    badge: "Routine Care",
    stats: "30-min in-depth exam",
    highlights: ["Complete vital signs & body score", "Ear, eye & dental evaluation", "Nutritional & weight profiling", "Digitized health record card"],
    price: "₹399",
  },
  {
    icon: Syringe,
    title: "Preventative Vaccinations & Parasite Control",
    desc: "Rigorous immunization protocols adhering to WSAVA global veterinary guidelines. Core and non-core vaccines paired with targeted deworming.",
    badge: "Essential",
    stats: "100% Cold-Chain Stored",
    highlights: ["DHPPiL, Rabies, KC, Corona vaccines", "Flea, tick & heartworm prophylaxis", "Vaccination booklet & automated SMS alerts", "Pre-vaccination health clearance"],
    price: "From ₹249",
  },
  {
    icon: Activity,
    title: "24/7 Emergency Trauma & Critical ICU",
    desc: "Always-ready resuscitation unit equipped with continuous multiparameter monitoring, supplemental oxygen therapy, and life support systems.",
    badge: "24/7 Available",
    stats: "< 3 min Triage Response",
    highlights: ["Accident, poisoning & trauma triage", "Oxygen cages & fluid therapy pumps", "On-site blood banking & cross-matching", "Dedicated 24/7 critical care nurses"],
    price: "Emergency Protocol",
  },
  {
    icon: Flame,
    title: "Advanced Soft-Tissue & Orthopedic Surgery",
    desc: "Sterile, HEPA-filtered operating suites equipped with precision isoflurane gas anesthesia, electrocautery, and orthopedic plating systems.",
    badge: "Surgical Theatre",
    stats: "1,200+ Surgeries Performed",
    highlights: ["Spay/neuter & soft-tissue excision", "Fracture repair & cruciate ligament surgery", "Safe pre-anesthetic blood panel", "Monitored recovery warming beds"],
    price: "Consultation First",
  },
  {
    icon: Microscope,
    title: "In-House Digital Diagnostics & Pathology",
    desc: "State-of-the-art diagnostic wing delivering blood, urine, cytological, and high-resolution radiographic imaging results in under 20 minutes.",
    badge: "Quick Results",
    stats: "Results in 20 Mins",
    highlights: ["Complete blood count (CBC) & serum biochemistry", "Digital high-frequency X-Ray radiography", "4D Doppler abdominal ultrasonography", "Microbiology & skin scrape cytology"],
    price: "From ₹499",
  },
  {
    icon: Scissors,
    title: "Therapeutic Dermatology & Clinical Grooming",
    desc: "Medicated treatments for stubborn fungal infections, allergic dermatitis, and ectoparasites, complemented by stress-free clinical grooming.",
    badge: "Hygiene & Skin",
    stats: "Medicated & Sanitized",
    highlights: ["Antifungal & antibacterial spa baths", "Deshedding, hygiene trim & sanitary cut", "Gentle ear canal flushing & nail trimming", "Dermatologist-prescribed ointments"],
    price: "From ₹449",
  },
];

// ─── DATA: DOCTORS ────────────────────────────────────────────────────────────
const VET_DOCTORS = [
  {
    name: "Dr. Arjun Sharma",
    degree: "BVSc & AH, MVSc (Surgery & Radiology)",
    role: "Chief Veterinary Surgeon & Medical Director",
    experience: "14+ Years Clinical Experience",
    image: "/doctors/doctor-1.jpg",
    speciality: "Orthopedic & Soft Tissue Surgery",
    rating: "4.99",
    patients: "8,500+ Treated",
  },
  {
    name: "Dr. Priya Mehra",
    degree: "BVSc & AH, MVSc (Veterinary Medicine)",
    role: "Senior Consultant – Dermatology & Internal Medicine",
    experience: "10+ Years Clinical Experience",
    image: "/doctors/doctor-2.jpg",
    speciality: "Allergy, Endocrine & Gastro Disorders",
    rating: "4.97",
    patients: "6,200+ Treated",
  },
  {
    name: "Dr. Rohan Kapoor",
    degree: "BVSc & AH, PG Dip. Emergency Critical Care",
    role: "Head of Emergency & Critical Care (ICU)",
    experience: "8+ Years Emergency Experience",
    image: "/doctors/doctor-3.jpg",
    speciality: "Trauma, Resuscitation & Intensive Care",
    rating: "4.98",
    patients: "4,800+ Treated",
  },
];

// ─── DATA: HOW IT WORKS ───────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Instant Booking or 24/7 Walk-In",
    desc: "Schedule online in 30 seconds or walk directly into our emergency triage room at any hour. No prior paperwork required.",
  },
  {
    num: "02",
    title: "Multi-Point Clinical Examination",
    desc: "Our board-certified veterinary physician performs a gentle, thorough nose-to-tail physical assessment in a calm, stress-free suite.",
  },
  {
    num: "03",
    title: "On-Site Diagnostics & Tailored Plan",
    desc: "If required, digital X-rays and blood analyses are delivered in under 20 minutes to form an exact, transparent treatment plan.",
  },
  {
    num: "04",
    title: "Care Delivery & Digital Follow-Up",
    desc: "Treatment is delivered with clinical excellence. Full medical charts are uploaded to your patient portal with 24/7 chat support.",
  },
];

// ─── DATA: TESTIMONIALS ───────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    pet: "Thor (Golden Retriever, 4 Yrs)",
    owner: "Vikram Singhania",
    service: "Emergency Gastric Torsion Surgery",
    review:
      "At 2 AM on a Sunday, Thor collapsed from bloat. The DogPet emergency team had him in the operating room within 15 minutes. Dr. Arjun Sharma saved my boy's life. The level of surgical precision and post-op ICU care is beyond anything I have seen in India.",
    rating: 5,
  },
  {
    pet: "Bella (Persian Cat, 2 Yrs)",
    owner: "Dr. Sunita Rao",
    service: "Chronic Allergic Dermatitis Treatment",
    review:
      "Bella suffered from unbearable itching and hair loss for 8 months with no cure from other clinics. Dr. Priya identified the precise environmental allergen within 2 days. Within two weeks, Bella’s coat was fully restored. Absolutely outstanding doctors.",
    rating: 5,
  },
  {
    pet: "Rocky (German Shepherd, 7 Yrs)",
    owner: "Amitav Chatterjee",
    service: "Orthopedic Cruciate Ligament Repair",
    review:
      "Rocky had a torn ACL and was limping severely. The DogPet orthopedic suite did digital radiographs and performed a flawless ligament repair. Today Rocky is running like a puppy again. Highly ethical, transparent, and world-class care.",
    rating: 5,
  },
];

// ─── DATA: FAQS ───────────────────────────────────────────────────────────────
const HOME_FAQS = [
  {
    q: "How does your 24/7 emergency triage service work?",
    a: "Our emergency triage unit is fully staffed 24 hours a day, 365 days a year by veterinary emergency physicians and critical care nurses. You do not need an appointment for trauma, acute poisoning, breathing difficulty, or sudden collapse. Simply call our emergency dispatch or bring your pet straight to the hospital.",
  },
  {
    q: "Are all doctors at DogPet Clinic licensed and specialized?",
    a: "Yes. All our veterinarians hold accredited BVSc & AH degrees recognized by the Veterinary Council of India (VCI), with several holding postgraduate master's degrees (MVSc) in Surgery, Radiology, and Internal Medicine.",
  },
  {
    q: "How quickly can I get blood test and X-ray results?",
    a: "Because we maintain fully automated in-house hematology and clinical biochemistry analyzers along with high-frequency digital radiography, standard blood counts and digital radiographs are processed and reviewed in 15 to 25 minutes.",
  },
  {
    q: "What safety protocols do you follow for pet surgery and anesthesia?",
    a: "Every surgical patient receives mandatory pre-anesthetic blood testing to evaluate liver and kidney function. We administer precision isoflurane gas anesthesia with continuous multi-parameter monitoring (ECG, pulse oximetry, blood pressure, end-tidal CO2, and temperature). Recovery occurs in temperature-regulated warming suites.",
  },
  {
    q: "Can I access my pet's medical records digitally?",
    a: "Yes. Every treatment, vaccination certificate, lab report, and prescription is securely archived in the DogPet Patient Portal, accessible through your phone or computer anytime.",
  },
];

// ─── COMPONENT: FAQ ITEM (LIGHT THEME) ─────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer p-5 ${
        open
          ? "bg-white border-[#9999ff]/50 shadow-md shadow-[#9999ff]/5"
          : "bg-white border-zinc-200 hover:border-zinc-300"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-bold text-zinc-900 tracking-tight">{q}</h4>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
            open
              ? "bg-[#9999ff] border-[#9999ff] text-white rotate-180"
              : "bg-zinc-100 border-zinc-200 text-zinc-500"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {open && (
        <p className="mt-3 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
          {a}
        </p>
      )}
    </div>
  );
}

// ─── MAIN HOME PAGE (LIGHT THEME) ─────────────────────────────────────────────
export default function Home() {
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#9999ff] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION — HEROUI LIGHT DESIGN
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-200">
        {/* Subtle Crimson Radial Glow on Light BG */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#9999ff]/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & HeroUI Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* HeroUI Pill Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-zinc-200 text-zinc-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#9999ff] animate-pulse" />
                <span>Premier Multi-Specialty Veterinary Care &amp; 24/7 ICU</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-zinc-950">
                World-Class{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-[#9999ff] to-[#9999ff]">
                  Healthcare
                </span>{" "}
                for Pets Who Mean Everything.
              </h1>

              {/* Comprehensive Description */}
              <p className="text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
                DogPet Clinic provides state-of-the-art veterinary medicine, precision surgery, advanced digital diagnostics, and round-the-clock emergency triage. Every pet receives compassionate, evidence-based care delivered by licensed medical specialists.
              </p>

              {/* HeroUI CTA Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2 items-center">
                <Link href={session?.user ? "/dashboard" : "/sign-in"}>
                  <button className="relative inline-flex items-center justify-center gap-2 rounded-full font-bold text-sm px-8 py-4 bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-lg shadow-[#9999ff]/25 hover:shadow-xl hover:shadow-[#9999ff]/35 active:scale-95 transition-all duration-200 cursor-pointer">
                    <span>Schedule an Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <a href="tel:+911234567890">
                  <button className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-sm px-7 py-4 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 shadow-2xs active:scale-95 transition-all duration-200 cursor-pointer">
                    <Phone className="w-4 h-4 text-[#9999ff]" />
                    <span>24/7 Emergency Dispatch</span>
                  </button>
                </a>
              </div>

              {/* Quick Clinical Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200">
                <div>
                  <div className="text-2xl font-black text-zinc-950">15,000+</div>
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Pets Treated
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#9999ff]">99.6%</div>
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Client Satisfaction
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-zinc-950">24/7</div>
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Emergency &amp; ICU
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-zinc-950">14+ Yrs</div>
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Clinical Excellence
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: HeroUI Interactive Pet Clinical Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-6 bg-white border border-zinc-200 shadow-xl">
                {/* Image showcase */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-5 border border-zinc-200">
                  <img
                    src="/hero_pets.png"
                    alt="DogPet Clinic Veterinary Center"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 text-zinc-900 font-semibold text-[11px] shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#9999ff] animate-pulse" />
                      Hospital Status: Fully Operational
                    </div>
                    <span className="text-white font-bold text-[11px] drop-shadow-sm">OTA Kota Center</span>
                  </div>
                </div>

                {/* Patient Health Monitor Simulated Card */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                    <span className="text-zinc-500 font-medium">Clinical Department Status</span>
                    <span className="text-[#9999ff] font-bold">Ready for Admission</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">Emergency ICU</div>
                      <div className="text-zinc-900 font-bold mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9999ff]" />
                        Active &amp; Ready
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">Surgical Theater</div>
                      <div className="text-zinc-900 font-bold mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        HEPA Sterile
                      </div>
                    </div>
                  </div>

                  {/* Doctor on call badge */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center font-bold text-xs text-zinc-800">
                        VET
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">Senior Vet On Duty</div>
                        <div className="text-[11px] text-zinc-500">Surgery &amp; Critical Care Available</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ACCREDITATION & TRUST TICKER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-7 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-6 text-xs text-zinc-700 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9999ff]" />
              <span>Veterinary Council of India (VCI) Licensed</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#9999ff]" />
              <span>ISO 9001:2015 Certified Clean Facility</span>
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-[#9999ff]" />
              <span>In-House Automated Pathology Lab</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9999ff]" />
              <span>Zero-Wait Emergency Triage Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#9999ff]" />
              <span>Compassionate Fear-Free Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COMPREHENSIVE CLINICAL SERVICES BENTO GRID (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Care
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Specialized Veterinary Medical Services
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              From routine immunizations to high-complexity surgeries, our departments are equipped with modern technology and seasoned specialists.
            </p>
          </div>

          {/* 6-Card Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLINICAL_SERVICES.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl p-6 bg-white border border-zinc-200 hover:border-[#9999ff]/50 hover:shadow-xl hover:shadow-[#9999ff]/5 transition-all duration-300 flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[#9999ff] group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {s.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="text-base font-bold text-zinc-950 group-hover:text-[#9999ff] transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>

                    {/* Key Highlights Checklist */}
                    <ul className="space-y-2 pt-2 border-t border-zinc-100">
                      {s.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-zinc-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#9999ff] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Row: Stat + Action */}
                  <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase block">
                        Estimated Fee
                      </span>
                      <span className="text-sm font-bold text-zinc-950">{s.price}</span>
                    </div>
                    <Link href="/services">
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-[#9999ff] hover:text-white border border-zinc-200 text-zinc-800 transition-all active:scale-95">
                        <span>Learn More</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Callout */}
          <div className="mt-12 text-center">
            <Link href="/services">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs bg-zinc-950 hover:bg-zinc-800 text-white transition-all active:scale-95 shadow-md">
                <span>View Full Clinical Directory &amp; Price Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#9999ff]" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — 4-STEP CLINICAL JOURNEY (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Clock className="w-3.5 h-3.5" />
              Streamlined Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              The DogPet Patient Care Workflow
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Designed from the ground up for minimal waiting times, transparent medical advice, and continuous post-treatment monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-3xl p-6 bg-white border border-zinc-200 hover:border-zinc-300 transition-all space-y-3 shadow-2xs"
              >
                <div className="text-3xl font-black text-[#9999ff] tracking-tighter">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-zinc-950">{step.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SENIOR VETERINARY FACULTY (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Award className="w-3.5 h-3.5" />
              Medical Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Meet Our Senior Veterinary Faculty
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Licensed by the Veterinary Council of India, our specialists have trained in premier national veterinary universities and completed thousands of successful cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VET_DOCTORS.map((doc, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-[#9999ff]/40 transition-all duration-300 flex flex-col group shadow-2xs"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-[#9999ff] border border-zinc-200 shadow-sm">
                    {doc.speciality}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">{doc.name}</h3>
                    <p className="text-xs text-[#9999ff] font-semibold mt-0.5">{doc.role}</p>
                    <p className="text-[11px] text-zinc-500 font-medium mt-1">{doc.degree}</p>
                    <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed">
                      Specialized clinical oversight with {doc.experience} and over {doc.patients}.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-800">
                      <Star className="w-3.5 h-3.5 fill-[#9999ff] text-[#9999ff]" />
                      <span>{doc.rating} / 5.0</span>
                    </div>
                    <Link href="/sign-in">
                      <button className="px-4 py-2 rounded-full text-xs font-semibold bg-[#9999ff] hover:bg-[#9999ff] text-white active:scale-95 transition-all shadow-xs">
                        Consult Doctor
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          24/7 EMERGENCY & AMBULANCE DISPATCH PROTOCOL (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-200 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200 shadow-md flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
                <AlertCircle className="w-3.5 h-3.5" />
                Golden Hour Response Protocol
              </div>
              <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
                Critical Pet Emergency? We Are Ready Right Now.
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                In acute emergencies, every minute counts. Our hospital operates an uncompromised 24-hour trauma service with oxygen stabilization, emergency hemorrhage control, and diagnostic ultrasound on standby.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start text-xs text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9999ff]" /> Oxygen Cages Ready
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9999ff]" /> Anti-Venom &amp; Toxin Antidotes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9999ff]" /> Blood Transfusion Bank
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href="tel:+911234567890"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Call Emergency: +91 12345 67890</span>
              </a>
              <Link
                href="/services#emergency"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-xs border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 transition-all text-center"
              >
                <span>Read Emergency Triage Instructions</span>
                <ArrowRight className="w-3 h-3 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          VERIFIED PATIENT STORIES & REVIEWS (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Heart className="w-3.5 h-3.5" />
              Verified Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Loved by Over 15,000+ Pet Families
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Read how our clinical team has made a life-changing difference for dogs, cats, and their devoted human parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#9999ff]">
                      {[...Array(t.rating)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-zinc-600 border border-zinc-200">
                      Verified Patient
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-zinc-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-zinc-900">{t.owner}</div>
                    <div className="text-[11px] text-[#9999ff] font-semibold">{t.pet}</div>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">{t.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          INTERACTIVE FAQS SECTION (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Frequently Answered
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Common Veterinary Inquiries
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Find transparent answers regarding hospital operations, surgery preparations, emergency arrivals, and digital records.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {HOME_FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL HEROUI CALL TO ACTION BANNER (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-[#9999ff] shadow-2xs">
              <PawPrint className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
              Give Your Pet the Excellence They Deserve.
            </h2>

            <p className="text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
              Book your consultation today or contact our 24/7 hospital reception. Our specialists are ready to provide gentle, world-class healthcare.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link href={session?.user ? "/dashboard" : "/sign-in"}>
                <button className="px-8 py-4 rounded-full font-bold text-sm bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-lg shadow-[#9999ff]/25 active:scale-95 transition-all cursor-pointer">
                  Book Online Appointment
                </button>
              </Link>
              <a href="tel:+911234567890">
                <button className="px-7 py-4 rounded-full font-semibold text-sm border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-2xs">
                  <Phone className="w-4 h-4 text-[#9999ff]" />
                  <span>Call Hospital: +91 12345 67890</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
