"use client";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Book, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const audiences = [
    {
      title: "School Libraries",
      subtitle:
        "Manage textbooks, student members, and daily borrowing records with ease.",
      footer: "Ideal for schools and small academic institutions.",
    },
    {
      title: "College Libraries",
      subtitle:
        "Organize large book collections, track borrowing history, and manage members.",
      footer: "Designed for colleges and training institutes.",
    },
    {
      title: "Community Libraries",
      subtitle:
        "Simple tools to handle issuing, returns, and due-date reminders.",
      footer: "Perfect for local and community-run libraries.",
    },
  ];

  const { data: session } = authClient.useSession();

  return (
    <main className="max-w-7xl mx-auto px-5 py-20 space-y-24">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
          A simple way to manage your library
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          A clean and modern library management system to handle books, members,
          borrow records, and reminders — all from one dashboard.
        </p>
      </section>

      {/* BUILT FOR */}
      <section className="rounded-3xl overflow-hidden bg-white border border-gray-200">
        <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-8 space-y-3">
            <h2 className="text-2xl font-semibold">Built for libraries</h2>

            <p className="text-gray-600 leading-relaxed text-sm">
              This app is designed to support different types of libraries by
              focusing on essential workflows like cataloging, issuing, tracking,
              and reminders.
            </p>
          </div>

          {audiences.map((item) => (
            <div key={item.title} className="p-8 space-y-3">
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.subtitle}</p>
              <p className="text-gray-400 text-xs pt-2">{item.footer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION – Alternative Design */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Content */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Our mission
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Our mission is to simplify everyday library work. From adding books
            and members to tracking borrowed items and due dates, we help librarians
            save time and reduce manual effort.
          </p>

          <p className="text-sm text-gray-500">
            We focus only on what matters most — clarity, reliability, and ease of use.
          </p>
        </div>

        {/* Right Cards */}
        <div className="grid gap-4">

          <div className="flex items-start gap-4 p-4 rounded-xl border bg-white">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Book className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">
                Book management
              </h4>
              <p className="text-sm text-gray-500">
                Add, update, and organize books with clear availability tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border bg-white">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">
                Borrow tracking
              </h4>
              <p className="text-sm text-gray-500">
                Track issued and returned books with due dates and history.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl border bg-white">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">
                Member records
              </h4>
              <p className="text-sm text-gray-500">
                Manage library members and their borrowing activity easily.
              </p>
            </div>
          </div>

        </div>
      </section>



      {/* FEATURES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Why libraries choose this app</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Easy book management",
              text: "Add, update, and organize books with clear availability tracking.",
            },
            {
              title: "Member & borrow records",
              text: "Maintain accurate member details and complete borrowing history.",
            },
            {
              title: "Due date reminders",
              text: "Keep returns on track with simple and timely reminders.",
            },
          ].map((card) => (
            <Card
              key={card.title}
              className="px-4 gap-3"
            >
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl border bg-white px-8 py-14 text-center">
        <h3 className="relative text-3xl font-semibold text-gray-900 mb-3">
          Manage your library with ease
        </h3>
        <p className="relative text-gray-600 max-w-xl mx-auto mb-8">
          Track books, members, and borrow records from one simple dashboard —
          no setup headaches, no unnecessary features.
        </p>
        <Link
          href={session ? "/dashboard" : "/sign-in"}
          className="relative inline-flex items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-7 py-3 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition text-xs"
        >
          {session ? "Go to Dashboard" : "Get Started"}
        </Link>
      </section>

    </main>
  );
}
