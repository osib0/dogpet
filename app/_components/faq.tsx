"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do you treat cats as well?",
    a: "Yes, we treat dogs, cats, and other domestic pets with the same level of care and attention.",
  },
  {
    q: "Is an appointment required before visiting?",
    a: "Appointments are recommended for faster service, but walk-ins are always welcome.",
  },
  {
    q: "Do you provide emergency services?",
    a: "Yes, DogPet Clinic offers 24/7 emergency care for critical and urgent situations.",
  },
  {
    q: "What should I bring for my pet’s first visit?",
    a: "Please bring any previous medical records, vaccination details, and your pet’s basic information.",
  },
  {
    q: "Are your veterinarians certified?",
    a: "Yes, all our veterinarians are fully certified, experienced, and trained in modern veterinary practices.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-28 bg-linear-to-b from-white to-[#f6fefb]">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block mb-3 text-xs font-semibold tracking-wider uppercase text-[#72e3ad]">
            FAQs
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">
            Frequently Asked <span className="text-[#72e3ad]">Questions</span>
          </h2>
          <p className="text-sm text-gray-600">
            Everything you need to know before visiting DogPet Clinic.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4 pb-2">
          {FAQS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="bg-white rounded-lg border shadow-none px-4"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-gray-900 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
