"use client";

const TESTIMONIALS = [
  {
    name: "Amit Sharma",
    pet: "Bruno (Dog)",
    review: "Excellent care and friendly doctors. My dog recovered very fast.",
  },
  {
    name: "Neha Verma",
    pet: "Milo (Cat)",
    review: "Clean clinic and very professional staff. Highly recommended!",
  },
  {
    name: "Rahul Singh",
    pet: "Rocky (Dog)",
    review: "Best veterinary clinic I’ve visited. Truly care about pets.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          What Pet Parents Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-[#f6fefb] p-6 rounded-2xl">
              <p className="text-sm text-gray-600 mb-4">“{t.review}”</p>
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-gray-500">{t.pet}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
