export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl mb-2 ">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: January 2026</p>

        <section className="space-y-6 text-gray-700 ">
          <p className="text-sm">
            This Privacy Policy explains how our{" "}
            <strong>Library Management System</strong> collects, uses, and
            protects your personal information. By using our services, you agree
            to this policy.
          </p>

          <div>
            <h2 className="text-sm mb-2  ">
              1. Information We Collect
            </h2>
            <ul className="text-xs list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Membership ID / Student or Employee ID</li>
              <li>Book issue and return history</li>
              <li>Login credentials (encrypted)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">
              2. How We Use Your Information
            </h2>
            <ul className="text-xs list-disc pl-6 space-y-1">
              <li>Managing library memberships</li>
              <li>Issuing and returning books</li>
              <li>Sending due-date and fine notifications</li>
              <li>Improving library services</li>
              <li>Maintaining security</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">
              3. Data Protection & Security
            </h2>
            <p className="text-xs">
              We implement appropriate technical and administrative measures to
              protect your personal data. However, no digital system is
              completely secure.
            </p>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">
              4. Sharing of Information
            </h2>
            <p className="text-xs">
              We do not sell or rent your personal information. Data is shared
              only with authorized staff or when legally required.
            </p>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">5. Cookies</h2>
            <p className="text-xs">
              We may use cookies to enhance user experience and maintain login
              sessions. You can disable cookies in your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">6. User Rights</h2>
            <ul className="text-xs list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Request corrections</li>
              <li>Request account deletion (as per rules)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">
              7. Changes to This Policy
            </h2>
            <p className="text-xs">
              This policy may be updated periodically. Changes will be reflected
              on this page.
            </p>
          </div>

          <div>
            <h2 className="text-sm mb-2  ">8. Contact Us</h2>
            <p className="text-xs">
              <strong>Library Administration</strong>
              <br />
              Email: support@library.com <br />
              Phone: +91-XXXXXXXXXX
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
