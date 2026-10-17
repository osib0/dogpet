"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Syringe,
  Activity,
  Scissors,
  Microscope,
  Phone,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  Flame,
  BadgeAlert,
} from "lucide-react";

// ─── SERVICES DIRECTORY DATA ──────────────────────────────────────────────────
const ALL_SERVICES = [
  {
    id: "wellness",
    category: "Preventative & OPD",
    title: "General Wellness Consultation & Physical Triage",
    tag: "Everyday Care",
    desc: "A thorough nose-to-tail physical assessment conducted by licensed veterinary doctors. Designed to catch subclinical illness before symptoms emerge.",
    details: [
      "Cardiopulmonary auscultation (heart & lung sounds)",
      "Ophthalmic, otic & oral cavity examination",
      "Abdominal palpation & lymph node check",
      "Body condition score & customized weight guidance",
      "Digital immunization & deworming audit",
    ],
    preparation: "Bring your pet’s past medical records, vaccination card, and note any recent appetite or behavior changes.",
    duration: "25 - 35 Minutes",
    price: "₹399",
  },
  {
    id: "vaccines",
    category: "Preventative & OPD",
    title: "Core & Non-Core Vaccinations with Parasite Control",
    tag: "Essential Protocol",
    desc: "Immunization program following WSAVA global standards. 100% cold-chain stored biologics administered after a mandatory physical temperature and vitals check.",
    details: [
      "Canine: DHPPiL (Distemper, Hepatitis, Parvo, Parainfluenza, Lepto) & Rabies",
      "Feline: FPV, FHV, FCV (Tricat Trio) & Anti-Rabies",
      "Kennel Cough (Bordetella) & Canine Corona protection",
      "Targeted broad-spectrum deworming tablet administration",
      "Free digitized vaccination certificate in Patient Portal",
    ],
    preparation: "Ensure pet is active, fever-free, and has normal appetite on the day of vaccination.",
    duration: "15 - 20 Minutes",
    price: "From ₹249",
  },
  {
    id: "emergency",
    category: "Critical Care & ICU",
    title: "24/7 Critical Trauma, Resuscitation & Intensive Care",
    tag: "Life Support",
    desc: "Immediate life-saving emergency medical attention for hit-by-run accidents, acute intoxication, gastric dilation (GDV), snake bites, and severe breathing distress.",
    details: [
      "Zero-wait immediate triage response by ICU nurses",
      "Central pipeline oxygen cages & mechanical ventilation",
      "Emergency blood transfusion & whole blood cross-matching",
      "Continuous multiparameter monitoring (ECG, SpO2, NIBP)",
      "Intravenous fluid therapy pumps & antidote administration",
    ],
    preparation: "Call our emergency hotline (+91 12345 67890) while en route so the triage resuscitation bay is prepared.",
    duration: "Immediate Triage",
    price: "Emergency Protocol",
  },
  {
    id: "surgery",
    category: "Surgery & Ortho",
    title: "Advanced Soft-Tissue & Laparoscopic Surgery",
    tag: "Sterile Theater",
    desc: "General and elective surgeries conducted in a HEPA-filtered positive-pressure operating room with precision isoflurane inhalation anesthesia.",
    details: [
      "Elective spaying (ovariohysterectomy) & neutering (castration)",
      "Tumor, cyst, and foreign body gastrointestinal excision",
      "Bladder cystotomy (urinary stone removal)",
      "Caesarean section & emergency obstetric intervention",
      "Heated post-anesthesia recovery warming bays",
    ],
    preparation: "Mandatory 8–10 hour pre-op food fast; pre-surgical complete blood count and kidney profile clearance.",
    duration: "1 - 3 Hours + Day Recovery",
    price: "Consultation First",
  },
  {
    id: "ortho",
    category: "Surgery & Ortho",
    title: "Orthopedic Surgery & Cruciate Ligament Repair",
    tag: "Specialized Plating",
    desc: "Complex bone fracture fixation, joint stabilization, and cruciate ligament repair using titanium and stainless-steel veterinary implant plates.",
    details: [
      "Internal dynamic compression bone plating & pinning",
      "Cruciate ligament (ACL) repair & patellar luxation correction",
      "Femoral head ostectomy (FHO) for severe hip dysplasia",
      "Intraoperative fluoroscopy guidance and post-op digital X-ray",
      "Comprehensive postoperative pain management regimen",
    ],
    preparation: "High-resolution multi-view digital radiographs required prior to surgical slot booking.",
    duration: "2 - 4 Hours + Monitored Hospitalization",
    price: "Specialist Consultation",
  },
  {
    id: "pathology",
    category: "Diagnostics & Lab",
    title: "Automated In-House Pathology & Hematology",
    desc: "On-site laboratory equipped with 5-part differential blood analyzers, automated wet biochemistry, and microbiological culture stations.",
    details: [
      "Complete Blood Count (CBC, ESR, Platelets) in 15 mins",
      "Liver (SGPT, SGOT, Alk Phos) & Kidney (BUN, Creatinine) panels",
      "Blood parasite screening (Ehrlichia, Babesia, Anaplasma)",
      "Urinalysis, urine sediment & stone chemical analysis",
      "Fungal DTM culture & microscopic skin scrape cytology",
    ],
    preparation: "For fasting biochemistry profiles, water is permitted but hold food for 6–8 hours.",
    duration: "15 - 30 Minutes",
    price: "From ₹499",
  },
  {
    id: "imaging",
    category: "Diagnostics & Lab",
    title: "Digital High-Frequency X-Ray & 4D Doppler Ultrasound",
    desc: "Low-radiation high-frequency radiography and ultrasound imaging to accurately visualize skeletal, thoracic, and abdominal internal organs.",
    details: [
      "High-contrast skeletal radiographs for fracture assessment",
      "Thoracic digital views for cardiac & pulmonary evaluation",
      "High-resolution abdominal organ ultrasound scanning",
      "Pregnancy confirmation & fetal viability scans",
      "Instant digital PACS export to your patient portal",
    ],
    preparation: "Abdominal ultrasound requires fasting for 8 hours and a moderately full urinary bladder.",
    duration: "20 - 40 Minutes",
    price: "From ₹699",
  },
  {
    id: "dermatology",
    category: "Skin & Hygiene",
    title: "Clinical Dermatology & Medicated Spa Therapy",
    desc: "Diagnostic skin cytology and targeted dermatological therapy for chronic atopic dermatitis, severe mange, yeast infections, and ectoparasites.",
    details: [
      "Wood's lamp examination & skin scrape cytology",
      "Food elimination allergy counseling and serum allergy testing",
      "Veterinary medicated bath (Chlorhexidine/Ketoconazole/Benzoyl)",
      "Deep ear canal flushing for resistant Otitis Externa",
      "Hygienic coat trim, sanitary cut & clinical nail trimming",
    ],
    preparation: "Avoid bathing your pet for 48 hours prior to diagnostic skin scraping.",
    duration: "45 - 60 Minutes",
    price: "From ₹449",
  },
  {
    id: "dental",
    category: "Preventative & OPD",
    title: "Ultrasonic Dental Scaling & Oral Surgery",
    tag: "Oral Care",
    desc: "Professional ultrasonic supra- and subgingival tartar removal, tooth polishing, and surgical dental extractions under monitored anesthesia.",
    details: [
      "Piezoelectric ultrasonic plaque and calculus debridement",
      "Subgingival periodontal pocket curettage",
      "Fine fluoride polishing paste application to inhibit plaque",
      "Surgical tooth extraction for loose, fractured, or infected teeth",
      "Prevention of secondary cardiac and renal bacterial seeding",
    ],
    preparation: "Overnight food fast required; pre-anesthetic blood screening recommended for senior pets.",
    duration: "45 - 60 Minutes",
    price: "From ₹899",
  },
];

// ─── DATA: PREVENTATIVE CARE PACKAGES ─────────────────────────────────────────
const CARE_PACKAGES = [
  {
    name: "Puppy & Kitten First-Year Protection",
    tag: "Essential Growth",
    price: "₹1,999",
    coverage: [
      "3x Core Vaccinations (DHPPiL / Tricat)",
      "2x Anti-Rabies Vaccinations with certification",
      "Full course of monthly broad-spectrum deworming",
      "3x Full Physical Vital Checkups & Growth Audits",
      "Personalized Diet & Behavioral Consultation",
    ],
  },
  {
    name: "Annual Complete Health MOT",
    tag: "Most Popular",
    price: "₹2,499",
    coverage: [
      "Full Head-to-Tail Clinical Examination",
      "Annual Booster Vaccination + Anti-Rabies",
      "Complete Blood Count (CBC 24-parameters)",
      "Kidney (Creatinine/BUN) & Liver (SGPT) Panel",
      "Routine Urine Analysis & Stool Parasite Screen",
    ],
  },
  {
    name: "Senior Pet Geriatric Care Panel (7+ Yrs)",
    tag: "Golden Years",
    price: "₹3,999",
    coverage: [
      "Senior Physical, Joint & Orthopedic Mobility Audit",
      "Comprehensive 18-parameter Biochemistry Blood Profile",
      "Digital Thoracic X-Ray (Heart & Lungs)",
      "Abdominal Diagnostic Ultrasound Screen",
      "Blood Pressure (NIBP) & Cardiac Arrhythmia Screen",
    ],
  },
];

// ─── DATA: EMERGENCY CHECKLIST ────────────────────────────────────────────────
const EMERGENCY_TIPS = [
  {
    condition: "Heat Stroke / Hyperthermia",
    action: "Move pet to shaded cool area immediately. Apply cool (not ice cold) tap water to paws, groin, and neck. Turn on AC and rush to our ICU.",
  },
  {
    condition: "Suspected Poison / Toxin Ingestion",
    action: "Do NOT induce vomiting without consulting a vet. Take a photo of the chemical/chocolate/plant packaging and bring it with you immediately.",
  },
  {
    condition: "Motor Vehicle Accident / Trauma",
    action: "Minimize spine movement. Gently place pet on a firm blanket or board. Cover open wounds with clean cloth. Apply gentle direct pressure to bleeders.",
  },
  {
    condition: "Bloat / Gastric Dilation (GDV)",
    action: "If dog attempts to vomit with no food coming up, has a hard distended abdomen, or displays severe pacing — this is a fatal surgical emergency. Call us immediately.",
  },
];

// ─── DATA: SERVICES FAQS ──────────────────────────────────────────────────────
const SERVICES_FAQS = [
  {
    q: "Why does my pet need to fast before anesthesia or surgery?",
    a: "Anesthetic medications relax normal swallowing reflexes. If a pet has food in their stomach, they may vomit during induction or recovery and inhale (aspirate) food particles into their lungs, causing life-threatening aspiration pneumonia. A mandatory 8–10 hour food fast prevents this risk.",
  },
  {
    q: "How frequently should my adult dog or cat be vaccinated?",
    a: "After completing initial puppy/kitten vaccination series, core booster vaccines and anti-rabies immunizations are administered annually under Indian veterinary regulations to ensure protective antibody titers remain strong.",
  },
  {
    q: "What is ultrasonic dental scaling and why can't it be done awake?",
    a: "Ultrasonic scaling removes calcified tartar below the gumline where harmful periodontal bacteria live. Pets cannot remain perfectly still with sharp vibrating instruments near delicate oral tissue. Monitored general anesthesia ensures safe, pain-free, and complete dental prophylaxis.",
  },
  {
    q: "Can I receive lab test results on my mobile phone?",
    a: "Yes. All blood reports, digital radiographs, ultrasound scans, and prescriptions are uploaded directly to the DogPet Patient Portal, accessible anytime with your registered phone number.",
  },
];

// ─── SERVICES PAGE COMPONENT (LIGHT THEME) ────────────────────────────────────
export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    "All",
    "Preventative & OPD",
    "Surgery & Ortho",
    "Critical Care & ICU",
    "Diagnostics & Lab",
    "Skin & Hygiene",
  ];

  const filteredServices =
    activeTab === "All"
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === activeTab);

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
              <span>Full Clinical Scope • Inpatient &amp; Outpatient</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
              Specialized Veterinary Healthcare Designed for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-[#9999ff] to-[#9999ff]">
                Longevity &amp; Vitality.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
              From routine immunizations to delicate orthopedic fracture repairs and 24/7 ICU resuscitation, explore our comprehensive catalog of evidence-based veterinary treatments.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link href="/sign-in">
                <button className="px-8 py-3.5 rounded-full font-bold text-xs bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all cursor-pointer">
                  Book a Consultation
                </button>
              </Link>
              <a href="tel:+911234567890">
                <button className="px-7 py-3.5 rounded-full font-semibold text-xs border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-[#9999ff]" />
                  <span>24/7 Emergency Line</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HEROUI PILL FILTER TABS & SERVICES DIRECTORY (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
              Browse by Medical Department
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm">
              Filter our services by specialization to review procedures, guidelines, and estimated fees.
            </p>

            {/* HeroUI Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {categories.map((cat) => {
                const active = activeTab === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/25"
                        : "bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Service Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                className="rounded-3xl p-7 bg-white border border-zinc-200 hover:border-[#9999ff]/40 hover:shadow-xl hover:shadow-[#9999ff]/5 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xs"
              >
                <div className="space-y-4">
                  {/* Top row: Category, Tag, Fee */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {svc.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
                        {svc.tag}
                      </span>
                      <span className="text-sm font-bold text-zinc-950">{svc.price}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-zinc-950">{svc.title}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed mt-2">{svc.desc}</p>
                  </div>

                  {/* Procedures Checklist */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <span className="text-[11px] font-bold uppercase text-zinc-500 block tracking-wider">
                      Included Clinical Checks:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {svc.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#9999ff] shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preparation Guidelines */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
                    <span className="font-semibold text-zinc-900 block mb-0.5">
                      Parent Preparation Advice:
                    </span>
                    <span className="text-zinc-600 text-[11px] leading-relaxed">
                      {svc.preparation}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Duration & HeroUI CTA */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-[#9999ff]" />
                    <span>Est. Time: {svc.duration}</span>
                  </div>

                  <Link href="/sign-in">
                    <button className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-sm active:scale-95 transition-all">
                      Book This Service
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PREVENTATIVE HEALTH PACKAGES (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Bundled Value
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Comprehensive Health Care Packages
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Curated preventative care bundles that combine multi-organ blood profiling, digital imaging, and immunizations at discounted rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CARE_PACKAGES.map((pkg, i) => (
              <div
                key={i}
                className="rounded-3xl p-7 bg-zinc-50 border border-zinc-200 hover:border-[#9999ff]/40 hover:shadow-xl transition-all flex flex-col justify-between space-y-6 shadow-2xs"
              >
                <div className="space-y-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-[#9999ff] border border-zinc-200 shadow-2xs">
                    {pkg.tag}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">{pkg.name}</h3>
                    <div className="text-3xl font-black text-zinc-950 mt-2">{pkg.price}</div>
                    <span className="text-[11px] text-zinc-500">All inclusive package fee</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-zinc-200">
                    {pkg.coverage.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                        <CheckCircle2 className="w-4 h-4 text-[#9999ff] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/sign-in" className="pt-2">
                  <button className="w-full py-3.5 rounded-full font-bold text-xs bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all">
                    Select Package
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EMERGENCY TRIAGE INSTRUCTIONS FOR PET PARENTS (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="emergency" className="py-24 bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#9999ff]/10 text-[#9999ff] border border-[#9999ff]/20">
              <BadgeAlert className="w-3.5 h-3.5" />
              Emergency Triage Guide
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              What to Do in a Life-Threatening Pet Emergency
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Stay calm and follow these immediate first-aid protocols while contacting our 24/7 hospital reception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {EMERGENCY_TIPS.map((tip, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 bg-white border border-zinc-200 hover:border-zinc-300 transition-all space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
                  <span className="w-2 h-2 rounded-full bg-[#9999ff]" />
                  <h4>{tip.condition}</h4>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed pl-4">
                  {tip.action}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="tel:+911234567890"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Emergency Reception: +91 12345 67890</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CLINICAL FAQS ACCORDION (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Clinical Procedures &amp; Care FAQs
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Clear medical explanations regarding fasting, anesthesia risks, vaccination frequency, and test delivery.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {SERVICES_FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-zinc-50 border border-zinc-200 space-y-2"
              >
                <h4 className="text-sm font-bold text-zinc-950">{faq.q}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed border-t border-zinc-200 pt-2">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HEROUI CTA BANNER (LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-zinc-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Ready to Schedule Your Pet&apos;s Treatment?
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Book an appointment online in less than a minute. Our doctors are ready to deliver gentle, comprehensive care.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link href="/sign-in">
                <button className="px-8 py-3.5 rounded-full font-bold text-xs bg-[#9999ff] hover:bg-[#9999ff] text-white shadow-md shadow-[#9999ff]/20 active:scale-95 transition-all cursor-pointer">
                  Book Online Appointment
                </button>
              </Link>
              <a href="tel:+911234567890">
                <button className="px-7 py-3.5 rounded-full font-semibold text-xs border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-900 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-[#9999ff]" />
                  <span>Call Hospital Reception</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
