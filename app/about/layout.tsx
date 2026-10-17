import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – DogPet Clinic",
  description:
    "Learn about DogPet Clinic – our story, our team, and our commitment to providing compassionate, expert veterinary care for pets across India.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
