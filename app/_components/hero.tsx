"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { PawPrint, Star, Shield, ArrowRight, Heart, Phone } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const { data: session } = authClient.useSession();

  return (
    <section className="hero-section relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Background blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      {/* Paw print decorations */}
      <div className="paw-decoration paw-1">
        <PawPrint className="w-8 h-8 text-[#72e3ad]/30" />
      </div>
      <div className="paw-decoration paw-2">
        <PawPrint className="w-6 h-6 text-[#f4a261]/20" />
      </div>
      <div className="paw-decoration paw-3">
        <PawPrint className="w-10 h-10 text-[#72e3ad]/20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">

          {/* LEFT CONTENT */}
          <div className="hero-left">
            {/* Badge */}
            <div className="hero-badge">
              <span className="badge-dot" />
              <span>Over 5,000+ Happy Pets Treated</span>
            </div>

            {/* Heading */}
            <h1 className="hero-title">
              Find Your Pet's{" "}
              <span className="hero-title-accent">Perfect Care</span>{" "}
              Partner
            </h1>

            {/* Description */}
            <p className="hero-desc">
              Expert veterinary care with compassion. From routine checkups to
              emergency treatments — your pet's health is our priority, every single day.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <Link href={session?.user ? "/dashboard" : "/sign-in"}>
                <button className="hero-btn-primary">
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="tel:+911234567890">
                <button className="hero-btn-secondary">
                  <Phone className="w-4 h-4" />
                  <span>Talk to Vet</span>
                </button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="hero-stat-number">5k+</span>
                <span className="hero-stat-label">Happy Pets</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-number">10+</span>
                <span className="hero-stat-label">Years Experience</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-number">24/7</span>
                <span className="hero-stat-label">Emergency Care</span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-right">
            {/* Main image card */}
            <div className="hero-image-wrapper">
              <div className="hero-image-card">
                <img
                  src="/hero_pets.png"
                  alt="Happy pets at DogPet Clinic"
                  className="hero-img"
                />
                {/* Overlay gradient */}
                <div className="hero-image-overlay" />
              </div>

              {/* Floating Badge - Top */}
              <div className="hero-float-badge hero-float-top">
                <div className="float-badge-icon">
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <p className="float-badge-title">Best Pet Clinic</p>
                  <p className="float-badge-sub">Award 2024</p>
                </div>
              </div>

              {/* Floating Badge - Bottom Left */}
              <div className="hero-float-badge hero-float-bottom-left">
                <div className="float-badge-avatars">
                  {[1,2,3,4].map((n) => (
                    <div key={n} className="float-avatar" style={{ backgroundColor: ['#72e3ad','#f4a261','#4ecdc4','#ff6b9d'][n-1] }}>
                      {['A','B','C','D'][n-1]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="float-badge-title">5,000+ Clients</p>
                  <div className="float-stars">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
              </div>

              {/* Floating Badge - Right */}
              <div className="hero-float-badge hero-float-right">
                <div className="float-badge-icon float-badge-icon-green">
                  <Shield className="w-4 h-4 text-[#72e3ad]" />
                </div>
                <div>
                  <p className="float-badge-title">Certified Vets</p>
                  <p className="float-badge-sub">Trusted & Licensed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
