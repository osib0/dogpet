"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Star,
  Sparkles,
  Zap,
  Shield,
  Heart,
} from "lucide-react";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
// Primary: #34d399 (emerald-400)   Dark: #059669   Light bg: #d1fae5 / #f0fdf4

// ─── SERVICES DATA ────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Stethoscope,
    title: "General Health Checkups",
    desc: "Comprehensive physical examinations to monitor your pet's overall health, detect problems early, and keep them in peak condition.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    features: ["Full body examination", "Weight & vitals check", "Health score report", "Follow-up care plan"],
    price: "Starting ₹299",
    tag: "Most Popular",
    tagColor: "#34d399",
  },
  {
    icon: Syringe,
    title: "Vaccination & Preventive Care",
    desc: "Complete vaccination schedules and preventive treatments to protect your pet from serious and life-threatening diseases.",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    features: ["Core & non-core vaccines", "Deworming treatment", "Flea & tick prevention", "Vaccination card issued"],
    price: "Starting ₹199",
    tag: "Essential",
    tagColor: "#6366f1",
  },
  {
    icon: HeartPulse,
    title: "Emergency & Critical Care",
    desc: "Immediate expert medical attention for accidents, sudden illness, poisoning, and all life-threatening conditions — available 24/7.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    features: ["24/7 availability", "Intensive care unit", "Trauma & injury care", "Poison & toxin treatment"],
    price: "On-call pricing",
    tag: "24/7",
    tagColor: "#ef4444",
  },
  {
    icon: Bone,
    title: "Surgery & Treatment",
    desc: "Safe, modern surgical procedures performed by our experienced veterinary surgeons using the latest medical equipment.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    features: ["Soft tissue surgery", "Orthopaedic procedures", "Dental surgery", "Post-op recovery care"],
    price: "Consultation first",
    tag: "Expert Care",
    tagColor: "#f59e0b",
  },
  {
    icon: Scissors,
    title: "Grooming & Hygiene",
    desc: "Professional grooming services to keep your pet clean, comfortable, healthy, and looking their absolute best.",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    features: ["Bath & blow-dry", "Nail trimming", "Ear cleaning", "Breed-specific styling"],
    price: "Starting ₹399",
    tag: "Pamper Time",
    tagColor: "#ec4899",
  },
  {
    icon: Microscope,
    title: "Diagnostics & Lab Tests",
    desc: "Advanced diagnostic services including blood panels, urine analysis, X-rays, ultrasound, and comprehensive health screenings.",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.12)",
    features: ["Blood & urine tests", "Digital X-ray", "Ultrasound imaging", "Biopsy & culture"],
    price: "Starting ₹499",
    tag: "Precision",
    tagColor: "#0ea5e9",
  },
  {
    icon: PawPrint,
    title: "Nutrition & Diet Consultation",
    desc: "Personalized diet plans and expert nutritional guidance based on your pet's specific breed, age, weight, and health status.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    features: ["Custom meal plans", "Supplement guidance", "Weight management", "Allergy diet plans"],
    price: "Starting ₹149",
    tag: "Wellness",
    tagColor: "#10b981",
  },
  {
    icon: Ambulance,
    title: "Pet Ambulance",
    desc: "Prompt and safe pet transport for emergencies and routine hospital visits — equipped with basic life support on board.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    features: ["GPS-tracked vehicles", "Trained handlers", "Basic life support", "City-wide coverage"],
    price: "Starting ₹299",
    tag: "Door-to-Door",
    tagColor: "#8b5cf6",
  },
];

const WHY_FEATURES = [
  { icon: Shield, title: "Certified Veterinarians", desc: "All our doctors are licensed by the Veterinary Council of India with years of hands-on experience." },
  { icon: Zap, title: "Fast & Accurate Diagnosis", desc: "Modern lab equipment ensures quick, accurate results so treatment can begin without delay." },
  { icon: Heart, title: "Stress-Free Environment", desc: "Our clinic is designed to be calm, clean, and welcoming — minimizing anxiety for your pet." },
  { icon: Clock, title: "On-Time, Every Time", desc: "We respect your time. Scheduled appointments always start on time with no long waits." },
];

const FAQS = [
  {
    q: "Do I need an appointment for a checkup?",
    a: "Walk-ins are welcome for minor consultations, but we recommend booking an appointment in advance for comprehensive checkups to ensure minimal waiting time.",
  },
  {
    q: "What vaccines does my dog/cat need?",
    a: "Core vaccines for dogs include Distemper, Parvovirus, Hepatitis, and Rabies. For cats: Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia, and Rabies. Our vets will guide you based on your pet's age and lifestyle.",
  },
  {
    q: "Is your clinic open on weekends?",
    a: "Yes! We are open 7 days a week from 9 AM to 9 PM. Our emergency line is available 24/7 for urgent cases.",
  },
  {
    q: "How do I prepare my pet for surgery?",
    a: "Your vet will provide specific pre-surgery instructions. Typically, pets should fast for 8–12 hours before the procedure. We'll walk you through everything beforehand.",
  },
  {
    q: "Do you offer home visits?",
    a: "Yes, we offer home visits for select services including post-surgery follow-ups, elderly pets, and stress-sensitive animals. Call us to check availability.",
  },
];

// ─── SECTION PILL ──────────────────────────────────────────────────────────────

function SectionPill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
      style={
        dark
          ? { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1.5px solid rgba(52,211,153,0.3)" }
          : { background: "rgba(52,211,153,0.12)", color: "#059669", border: "1.5px solid rgba(52,211,153,0.3)" }
      }
    >
      <Sparkles className="w-3 h-3" />
      {children}
    </span>
  );
}

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all cursor-pointer"
      style={{ borderColor: open ? "rgba(52,211,153,0.4)" : "#e5e7eb" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <p className="font-semibold text-gray-900 text-sm pr-4">{q}</p>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all text-white text-sm font-black"
          style={{ background: open ? "#34d399" : "#e5e7eb", color: open ? "white" : "#9ca3af" }}
        >
          {open ? "−" : "+"}
        </div>
      </div>
      {open && (
        <div className="px-6 pb-5 bg-white">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <main className="overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #ecfdf5 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute w-[700px] h-[700px] rounded-full -top-64 -right-64 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full -bottom-32 -left-32 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <SectionPill>What We Offer</SectionPill>

          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Comprehensive Care for{" "}
            <span className="relative inline-block" style={{ color: "#34d399" }}>
              Every Pet
              <span className="absolute bottom-1 left-0 right-0 h-1 rounded-full opacity-40"
                style={{ background: "linear-gradient(90deg, #34d399, #059669)" }} />
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            From routine health checkups to advanced surgeries and 24/7 emergency care —
            DogPet Clinic provides everything your pet needs to live a healthy, happy life.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #34d399, #059669)", boxShadow: "0 8px 32px rgba(52,211,153,0.35)" }}
            >
              Book Appointment <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="tel:+911234567890"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border-2 bg-white transition-all hover:-translate-y-1"
              style={{ borderColor: "#34d399", color: "#059669" }}
            >
              <Phone className="w-4 h-4" /> Emergency: 24/7
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
            {[["8+", "Services"], ["5,000+", "Pets Treated"], ["24/7", "Emergency"], ["10+", "Yrs Experience"]].map(([val, lbl], i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black" style={{ color: "#34d399" }}>{val}</div>
                <div className="text-xs text-gray-500 font-medium">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0c1932 100%)" }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionPill dark>All Services</SectionPill>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Everything Your Pet Needs
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              Explore our full range of veterinary services — each delivered with expertise, compassion, and care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${svc.color}18, transparent 70%)` }} />

                  {/* Tag */}
                  <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: svc.tagColor }}>
                    {svc.tag}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-[-6deg]"
                    style={{ background: svc.bg }}>
                    <Icon className="w-7 h-7" style={{ color: svc.color }} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-3 relative z-10">{svc.title}</h3>
                  <p className="text-xs leading-relaxed mb-4 relative z-10" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {svc.desc}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-5 relative z-10">
                    {svc.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: svc.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold" style={{ color: svc.color }}>{svc.price}</span>
                    <div className="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: svc.color }}>
                      Book Now <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

            {/* Left */}
            <div>
              <SectionPill>Why DogPet Clinic</SectionPill>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">
                Excellence in Every <span style={{ color: "#34d399" }}>Treatment</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                We combine modern veterinary medicine with genuine compassion to deliver an experience
                that both pets and their families trust. Here's what sets us apart:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {WHY_FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(52,211,153,0.12)" }}>
                        <Icon className="w-5 h-5" style={{ color: "#34d399" }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Testimonials strip */}
            <div className="space-y-4">
              {[
                { name: "Rahul Verma", pet: "Golden Retriever owner", stars: 5, review: "The team at DogPet is absolutely amazing. My dog Bruno had emergency surgery and they handled everything perfectly. Couldn't be more grateful!" },
                { name: "Anjali Singh", pet: "Cat parent", stars: 5, review: "I bring both my cats here for all their checkups. The vets are so gentle and patient. The grooming service is phenomenal too!" },
                { name: "Vikram Nair", pet: "Labrador owner", stars: 5, review: "Fantastic clinic! The diagnosis was accurate, treatment was effective, and follow-up care was exceptional. Highly recommended." },
              ].map((t, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all bg-white">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic mb-3">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.pet}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROCESS
      ══════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #f0fdf9 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionPill>How It Works</SectionPill>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              Simple <span style={{ color: "#34d399" }}>4-Step Process</span>
            </h2>
            <p className="text-gray-500">Getting care for your pet is simple and stress-free with DogPet Clinic.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
            {/* connector line */}
            <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 rounded-full"
              style={{ background: "linear-gradient(90deg, #34d399, #d1fae5, #34d399)" }} />

            {[
              { step: "01", title: "Book Online", desc: "Schedule your appointment through our website or call us directly.", icon: Phone },
              { step: "02", title: "Visit the Clinic", desc: "Bring your pet in at the scheduled time. We'll greet you warmly.", icon: MapPin },
              { step: "03", title: "Expert Consultation", desc: "Our vet examines your pet, runs tests if needed, and creates a care plan.", icon: Stethoscope },
              { step: "04", title: "Healthy & Happy", desc: "Treatment is provided and you receive full aftercare instructions.", icon: Heart },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative text-center group">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-white text-sm font-black shadow-lg z-10 relative transition-transform group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}>
                    {s.step}
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group-hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(52,211,153,0.12)" }}>
                      <Icon className="w-5 h-5" style={{ color: "#34d399" }} />
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">{s.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <SectionPill>FAQs</SectionPill>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                Common <span style={{ color: "#34d399" }}>Questions</span>
              </h2>
              <p className="text-gray-500">Everything you need to know before your first visit.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)" }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(255,255,255,0.1)" }}>
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
              Your Pet Deserves the Best
            </h2>
            <p className="text-emerald-200 mb-10 text-base">
              Book an appointment today and give your pet the expert care they deserve — right here at DogPet Clinic.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ color: "#059669" }}
              >
                Book Appointment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border-2 border-white/30 text-white bg-white/10 transition-all hover:-translate-y-1 hover:bg-white/20"
              >
                <Phone className="w-4 h-4" /> +91 12345 67890
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
