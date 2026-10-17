import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services – DogPet Clinic",
  description:
    "Explore comprehensive veterinary services at DogPet Clinic – from routine checkups and vaccinations to emergency care, surgery, grooming, and more.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
