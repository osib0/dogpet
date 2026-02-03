"use client";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background-light text-[#2B3038] px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Page Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold  tracking-tight text-[#101419] ">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            Last Updated: January 2026
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xs text-gray-600">
            These Terms & Conditions govern the use of the Institutional Library
            Management System. Please read them carefully before accessing or
            using library services.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="p-8 md:p-12 space-y-12 text-sm leading-relaxed">

            {/* Section 1 */}
            <Section number="1" title="Acceptance of Terms">
              <p className="text-xs">
                By accessing or using the Library Management System, you confirm
                that you have read, understood, and agreed to comply with these
                Terms & Conditions and all applicable institutional policies.
              </p>
            </Section>

            {/* Section 2 */}
            <Section number="2" title="Authorized Access & Eligibility">
              <p className="text-xs">
                Access to the system is strictly limited to currently enrolled
                students, faculty members, and authorized library staff. Users
                are responsible for ensuring that their account credentials
                remain secure and accurate.
              </p>
            </Section>

            {/* Section 3 */}
            <Section number="3" title="User Responsibilities">
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>Safeguard login credentials and institutional ID</li>
                <li>Use library resources solely for academic and research purposes</li>
                <li>Adhere to borrowing limits and return deadlines</li>
                <li>Respect copyright laws and institutional regulations</li>
              </ul>

              <Callout>
                Misuse of library resources or violation of policies may lead to
                temporary suspension or permanent revocation of access.
              </Callout>
            </Section>

            {/* Section 4 */}
            <Section number="4" title="Use of Library Resources">
              <p className="text-xs">
                Library materials, both physical and digital, are provided for
                educational use only. Unauthorized reproduction, distribution,
                or commercial use of resources is strictly prohibited.
              </p>
            </Section>

            {/* Section 5 */}
            <Section number="5" title="Account Suspension & Termination">
              <p className="text-xs">
                The institution reserves the right to suspend or terminate user
                access without prior notice in cases of policy violations,
                security concerns, or misuse of the Library Management System.
              </p>
            </Section>

            {/* Section 6 */}
            <Section number="6" title="System Availability & Maintenance">
              <p className="text-xs">
                While reasonable efforts are made to ensure uninterrupted
                access, the system may be temporarily unavailable due to
                maintenance, upgrades, or technical disruptions.
              </p>
            </Section>

            {/* Section 7 */}
            <Section number="7" title="Limitation of Liability">
              <p className="text-xs">
                The institution shall not be held responsible for any direct,
                indirect, or incidental damages arising from the use or
                inability to access the Library Management System.
              </p>
            </Section>

            {/* Section 8 */}
            <Section number="8" title="Updates to Terms">
              <p className="text-xs">
                These Terms & Conditions may be revised periodically. Continued
                use of the system after updates signifies acceptance of the
                revised terms.
              </p>
            </Section>

          </div>

          {/* Contact Section */}
          <div className="bg-[#F0F4F8] border-t border-gray-200 p-8">
            <h3 className="font-bold text-sm mb-2 text-[#101419] ">
              9. Contact Information
            </h3>
            <p className="text-xs mb-4 text-gray-600">
              For clarification or questions regarding these Terms & Conditions,
              please contact the library administration.
            </p>

            <div className="space-y-2 text-sm font-medium">
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-primary">
                  mail
                </span>
                terms@library.inst
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-primary">
                  call
                </span>
                +1 (555) 092-1847
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

/* ---------------- Components ---------------- */

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-3 text-primary text-sm font-bold">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-xs">
          {number}
        </span>
        {title}
      </h2>

      <div className="text-gray-700">
        {children}
      </div>

      <div className="h-px bg-gray-200" />
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-primary">
      {children}
    </div>
  );
}
