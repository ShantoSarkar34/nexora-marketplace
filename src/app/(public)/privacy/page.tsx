import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {" "}
      <div className="mx-auto max-w-4xl">
        <header className="border-border border-b pb-8">
          {" "}
          <div className="bg-brand-500/10 text-brand-600 flex h-12 w-12 items-center justify-center rounded-xl">
            {" "}
            <ShieldCheck className="h-6 w-6" />{" "}
          </div>
          <p className="text-brand-600 mt-5 text-sm font-semibold tracking-wide uppercase">
            Legal
          </p>
          <h1 className="text-text-primary mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-text-secondary mt-4 text-sm leading-6 sm:text-base">
            Your privacy matters to us. This Privacy Policy explains what
            information Nexora collects, how we use it, and how we protect your
            information when you use our platform.
          </p>
          <p className="text-text-secondary mt-4 text-xs">
            Last updated: September 21, 2026
          </p>
        </header>

        {/* Content */}
        <article className="text-text-secondary mt-10 space-y-10 text-sm leading-7">
          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              1. Introduction
            </h2>

            <p className="mt-3">
              Nexora is an online freelance marketplace that connects clients
              with freelancers and provides tools for discovering jobs, managing
              applications, creating contracts, processing payments, and
              building professional profiles.
            </p>

            <p className="mt-3">
              By using Nexora, you agree to the collection and use of
              information as described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              2. Information We Collect
            </h2>

            <p className="mt-3">
              We may collect information that you provide directly when you
              create an account, complete your profile, communicate with other
              users, or use our services.
            </p>

            <h3 className="text-text-primary mt-5 font-medium">
              Account information
            </h3>

            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Name</li>
              <li>Email address</li>
              <li>Password or authentication information</li>
              <li>Account role, such as Client or Freelancer</li>
              <li>Profile and account verification information</li>
            </ul>

            <h3 className="text-text-primary mt-5 font-medium">
              Freelancer information
            </h3>

            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Professional title and biography</li>
              <li>Skills</li>
              <li>Hourly rate</li>
              <li>Work experience</li>
              <li>Portfolio projects</li>
              <li>Profile image</li>
              <li>Reviews and ratings</li>
            </ul>

            <h3 className="text-text-primary mt-5 font-medium">
              Client information
            </h3>

            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Company name</li>
              <li>Industry and company information</li>
              <li>Company description</li>
              <li>Company size</li>
              <li>Website and profile information</li>
              <li>Profile image</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              3. How We Use Your Information
            </h2>

            <p className="mt-3">
              We use collected information to provide, maintain, and improve
              Nexora and its marketplace features.
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Create and manage your account</li>
              <li>Authenticate and verify your identity</li>
              <li>Display professional and company profiles</li>
              <li>Connect clients with relevant freelancers</li>
              <li>Provide job recommendations and matching features</li>
              <li>Process applications and hiring workflows</li>
              <li>Manage contracts and payments</li>
              <li>Send important account and service notifications</li>
              <li>Respond to support requests</li>
              <li>Detect and prevent fraud or unauthorized activity</li>
              <li>Improve the functionality and security of the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              4. Public Profile Information
            </h2>

            <p className="mt-3">
              Some information you add to your Nexora profile may be visible to
              other users or publicly accessible. This may include your name,
              professional title, profile image, skills, biography, portfolio,
              experience, reviews, ratings, or company information, depending on
              your account type and platform features.
            </p>

            <p className="mt-3">
              Do not add sensitive personal information to a public profile that
              you do not want other users to see.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              5. Authentication and Account Security
            </h2>

            <p className="mt-3">
              Nexora may use authentication methods such as email verification,
              OTP verification, password recovery, JWT-based authentication,
              secure HTTP-only cookies, and Google OAuth.
            </p>

            <p className="mt-3">
              Authentication information is used to protect accounts and provide
              access to authorized features. You are responsible for keeping
              your account credentials secure and should notify us if you
              believe your account has been compromised.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              6. Payments
            </h2>

            <p className="mt-3">
              Payment transactions may be processed through third-party payment
              providers such as Stripe. Nexora does not need to store your
              complete payment card information when payment processing is
              handled by the payment provider.
            </p>

            <p className="mt-3">
              Payment providers may collect and process information according to
              their own privacy policies and terms.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              7. Cookies and Local Storage
            </h2>

            <p className="mt-3">
              Nexora may use cookies, local storage, and similar technologies to
              maintain authentication sessions, remember preferences, improve
              functionality, and provide a better user experience.
            </p>

            <p className="mt-3">
              Some cookies or storage mechanisms may be necessary for the
              platform to function correctly.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              8. Third-Party Services
            </h2>

            <p className="mt-3">
              Nexora may rely on trusted third-party services to provide certain
              platform features. These services may include authentication,
              payment processing, image hosting, email delivery, database
              infrastructure, or caching services.
            </p>

            <p className="mt-3">
              Third-party providers process information according to their own
              terms and privacy policies. We recommend reviewing the privacy
              practices of any third-party service you interact with through
              Nexora.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              9. AI-Powered Features
            </h2>

            <p className="mt-3">
              Nexora may use AI-powered functionality to provide features such
              as job and freelancer matching or recommendations. Information
              related to your professional profile, skills, experience, and job
              requirements may be used to generate relevant matches.
            </p>

            <p className="mt-3">
              AI-generated recommendations are intended to assist users and
              should not be treated as a guarantee of employment, hiring, or
              project success.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              10. Data Security
            </h2>

            <p className="mt-3">
              We take reasonable technical and organizational measures to
              protect your information from unauthorized access, alteration,
              disclosure, or destruction.
            </p>

            <p className="mt-3">
              However, no internet-based service can guarantee absolute
              security. You should use a strong, unique password and take
              reasonable steps to protect your account.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              11. Data Retention
            </h2>

            <p className="mt-3">
              We retain information for as long as reasonably necessary to
              provide our services, maintain account records, fulfill legitimate
              business purposes, resolve disputes, enforce agreements, and
              comply with applicable legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              12. Your Rights
            </h2>

            <p className="mt-3">
              Depending on applicable law, you may have rights regarding your
              personal information, including the ability to access, update,
              correct, or request deletion of certain information associated
              with your account.
            </p>

            <p className="mt-3">
              If you have a privacy-related request, please contact Nexora
              through the Contact page.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              13. Children&apos;s Privacy
            </h2>

            <p className="mt-3">
              Nexora is not intended for children who are not legally permitted
              to use online employment or freelance marketplace services. We do
              not knowingly collect personal information from children in
              violation of applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-text-primary text-xl font-semibold">
              14. Changes to This Privacy Policy
            </h2>

            <p className="mt-3">
              We may update this Privacy Policy from time to time to reflect
              changes to our services, technology, or legal requirements. When
              changes are made, the updated policy will be published on this
              page along with a revised update date.
            </p>
          </section>

          <section className="border-brand-500/20 bg-brand-500/5 rounded-xl border p-6">
            <h2 className="text-text-primary text-xl font-semibold">
              15. Contact Us
            </h2>

            <p className="mt-3">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or the way Nexora handles your information, please
              contact our support team.
            </p>

            <p className="text-text-primary mt-4 font-medium">
              Email: support@nexora.com
            </p>

            <p className="text-text-secondary mt-1 text-sm">
              You can also reach us through the Nexora Contact page.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
