import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Gavel,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="border-border bg-background border-b">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Nexora
          </Link>

          <div className="border-border bg-muted inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <FileText className="h-4 w-4" />
            Terms of Service
          </div>
          </div>

          <h1 className="text-text-primary text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>

          <p className="text-text-secondary mt-5 max-w-2xl text-lg leading-8">
            These terms explain the rules and conditions for using Nexora,
            including creating accounts, posting jobs, applying for work,
            communicating with other users, and using our marketplace features.
          </p>

          <p className="text-text-secondary mt-6 text-sm">
            Last updated: September 21, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* 1 */}
          <section>
            <SectionHeading
              icon={<CheckCircle2 className="h-5 w-5" />}
              number="01"
              title="Acceptance of Terms"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                By accessing or using Nexora, you agree to comply with these
                Terms of Service and all applicable laws and regulations.
              </p>

              <p>
                If you do not agree with these terms, you should not create an
                account or use Nexora's services.
              </p>

              <p>
                These terms apply to all users of the platform, including
                clients, freelancers, visitors, and administrators.
              </p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <SectionHeading
              icon={<Users className="h-5 w-5" />}
              number="02"
              title="User Accounts"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                You may need to create an account to access certain Nexora
                features. You are responsible for providing accurate and
                up-to-date information.
              </p>

              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities performed through
                your account.
              </p>

              <p>
                You must not create an account using another person's identity
                or provide misleading information about yourself, your business,
                skills, experience, or qualifications.
              </p>

              <p>
                Nexora may restrict, suspend, or terminate accounts that violate
                these terms or otherwise misuse the platform.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <SectionHeading
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              number="03"
              title="Using Nexora as a Client"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Clients may use Nexora to create job listings, review
                applications, communicate with freelancers, hire freelancers,
                manage contracts, and provide reviews.
              </p>

              <p>When posting a job, clients should:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Provide accurate and meaningful job information.</li>
                <li>
                  Clearly describe expected deliverables and requirements.
                </li>
                <li>Provide realistic budgets and project expectations.</li>
                <li>Avoid discriminatory or unlawful requirements.</li>
                <li>Communicate honestly with applicants and freelancers.</li>
              </ul>

              <p>
                Clients are responsible for evaluating applicants and making
                their own hiring decisions.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <SectionHeading
              icon={<Users className="h-5 w-5" />}
              number="04"
              title="Using Nexora as a Freelancer"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Freelancers may use Nexora to create professional profiles,
                discover jobs, submit applications, communicate with clients,
                manage contracts, and receive reviews.
              </p>

              <p>Freelancers agree to:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Provide truthful information about their skills and
                  experience.
                </li>
                <li>
                  Submit applications that accurately represent their abilities.
                </li>
                <li>
                  Deliver agreed work according to the applicable contract.
                </li>
                <li>Communicate professionally with clients.</li>
                <li>Respect intellectual property and confidentiality.</li>
              </ul>

              <p>
                Freelancers are responsible for ensuring that portfolio items,
                work samples, qualifications, and other information they submit
                do not infringe another person's rights.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section>
            <SectionHeading
              icon={<FileText className="h-5 w-5" />}
              number="05"
              title="Jobs, Applications, and Contracts"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora provides tools that allow clients and freelancers to
                discover opportunities, submit applications, and establish
                project agreements.
              </p>

              <p>
                Any agreement between a client and freelancer is primarily
                between those parties. Nexora provides the platform and related
                tools but is not automatically a party to every agreement
                between users.
              </p>

              <p>
                Users should clearly define project scope, deliverables,
                deadlines, payment terms, revisions, ownership, and other
                important conditions before beginning work.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section>
            <SectionHeading
              icon={<ShieldCheck className="h-5 w-5" />}
              number="06"
              title="Payments"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora may provide payment functionality through third-party
                payment providers.
              </p>

              <p>
                Payment processing may be subject to the terms, privacy
                policies, fees, and requirements of the applicable payment
                provider.
              </p>

              <p>
                Users must not use Nexora's payment features for fraudulent,
                illegal, unauthorized, or otherwise prohibited transactions.
              </p>

              <p>
                Nexora may restrict transactions or accounts when activity
                appears to violate these terms, applicable law, or payment
                provider requirements.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <SectionHeading
              icon={<ShieldCheck className="h-5 w-5" />}
              number="07"
              title="Prohibited Activities"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>Users must not use Nexora to:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Commit fraud or facilitate illegal activities.</li>
                <li>Impersonate another person or organization.</li>
                <li>Upload malicious software or harmful code.</li>
                <li>Attempt to gain unauthorized access to the platform.</li>
                <li>
                  Abuse, harass, threaten, or discriminate against other users.
                </li>
                <li>Post misleading, fraudulent, or deceptive job listings.</li>
                <li>
                  Submit false qualifications or fabricated work experience.
                </li>
                <li>
                  Manipulate reviews, ratings, applications, or platform
                  activity.
                </li>
                <li>
                  Scrape, copy, or systematically collect platform data without
                  permission.
                </li>
                <li>
                  Use Nexora in a way that violates applicable laws or
                  regulations.
                </li>
              </ul>
            </div>
          </section>

          {/* 8 */}
          <section>
            <SectionHeading
              icon={<Gavel className="h-5 w-5" />}
              number="08"
              title="Reviews and Ratings"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora may allow users to leave ratings and written reviews
                after completing work or interacting through the platform.
              </p>

              <p>
                Reviews should represent genuine experiences and must not be
                manipulated, purchased, fabricated, or used to intentionally
                mislead other users.
              </p>

              <p>
                Nexora may remove reviews or related content that violates these
                terms, applicable policies, or platform rules.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section>
            <SectionHeading
              icon={<ShieldCheck className="h-5 w-5" />}
              number="09"
              title="AI-Powered Features"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora may provide AI-powered features such as job
                recommendations, freelancer matching, search assistance, or
                other intelligent tools.
              </p>

              <p>
                AI-generated recommendations are provided as assistance only.
                Users should independently review information and make their own
                decisions before hiring, applying, or entering into an
                agreement.
              </p>

              <p>
                AI-generated information may occasionally be incomplete,
                inaccurate, or unsuitable for a particular situation.
              </p>
            </div>
          </section>

          {/* 10 */}
          <section>
            <SectionHeading
              icon={<FileText className="h-5 w-5" />}
              number="10"
              title="Intellectual Property"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora's software, design, branding, interface, logos, and
                original platform content are owned by or licensed to Nexora
                unless otherwise stated.
              </p>

              <p>
                Users retain ownership of content they submit to Nexora, subject
                to the rights and permissions necessary for Nexora to operate
                the platform.
              </p>

              <p>
                Users must not copy, reproduce, modify, distribute, reverse
                engineer, or commercially exploit Nexora's proprietary platform
                content without appropriate permission.
              </p>
            </div>
          </section>

          {/* 11 */}
          <section>
            <SectionHeading
              icon={<ShieldCheck className="h-5 w-5" />}
              number="11"
              title="Privacy"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Your use of Nexora is also governed by our Privacy Policy, which
                explains how information may be collected, used, stored, and
                protected.
              </p>

              <p>
                Please review the{" "}
                <Link
                  href="/privacy"
                  className="text-text-primary underline underline-offset-4"
                >
                  Privacy Policy
                </Link>{" "}
                for additional information.
              </p>
            </div>
          </section>

          {/* 12 */}
          <section>
            <SectionHeading
              icon={<Gavel className="h-5 w-5" />}
              number="12"
              title="Disputes Between Users"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora may provide tools that help users communicate and manage
                projects, but disputes regarding work, payment, deadlines,
                deliverables, or other agreements are generally matters between
                the involved users.
              </p>

              <p>
                Users should attempt to resolve disagreements professionally and
                in accordance with the terms of their agreement.
              </p>

              <p>
                Where Nexora provides a dispute-resolution or support process,
                users agree to cooperate with reasonable requests related to
                that process.
              </p>
            </div>
          </section>

          {/* 13 */}
          <section>
            <SectionHeading
              icon={<ShieldCheck className="h-5 w-5" />}
              number="13"
              title="Platform Availability"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora aims to provide a reliable service but does not guarantee
                that the platform will always be available, uninterrupted,
                secure, or error-free.
              </p>

              <p>
                Maintenance, updates, technical problems, third-party
                dependencies, or circumstances outside our control may
                temporarily affect platform availability.
              </p>
            </div>
          </section>

          {/* 14 */}
          <section>
            <SectionHeading
              icon={<Gavel className="h-5 w-5" />}
              number="14"
              title="Account Suspension or Termination"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora may suspend, restrict, or terminate an account if a user
                violates these terms, abuses the platform, engages in fraudulent
                activity, or creates a significant risk to other users or the
                service.
              </p>

              <p>
                Users may stop using Nexora at any time and may request account
                deletion where supported by the platform.
              </p>

              <p>
                Certain obligations, including those relating to intellectual
                property, payments, disputes, and prohibited activities, may
                continue after account termination where applicable.
              </p>
            </div>
          </section>

          {/* 15 */}
          <section>
            <SectionHeading
              icon={<FileText className="h-5 w-5" />}
              number="15"
              title="Changes to These Terms"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                Nexora may update these Terms of Service from time to time to
                reflect changes to the platform, features, legal requirements,
                or business practices.
              </p>

              <p>
                When material changes are made, Nexora may provide appropriate
                notice through the platform or other available communication
                methods.
              </p>

              <p>
                Continued use of Nexora after updated terms become effective
                means that you agree to the revised terms.
              </p>
            </div>
          </section>

          {/* 16 */}
          <section>
            <SectionHeading
              icon={<Users className="h-5 w-5" />}
              number="16"
              title="Contact Us"
            />

            <div className="text-text-secondary space-y-4 leading-7">
              <p>
                If you have questions about these Terms of Service, please
                contact the Nexora team.
              </p>

              <p>
                Email:{" "}
                <a
                  href="mailto:support@nexora.com"
                  className="text-text-primary underline underline-offset-4"
                >
                  support@nexora.com
                </a>
              </p>
            </div>
          </section>

          {/* Final Notice */}
          <div className="border-border bg-muted/50 rounded-2xl border p-6 sm:p-8">
            <div className="flex gap-4">
              <ShieldCheck className="text-text-primary mt-0.5 h-6 w-6 shrink-0" />

              <div>
                <h2 className="text-text-primary text-lg font-semibold">
                  Important Notice
                </h2>

                <p className="text-text-secondary mt-2 text-sm leading-6">
                  This Terms of Service page is intended for the Nexora
                  portfolio/demo project. If Nexora is launched as a real
                  commercial service, these terms should be reviewed and adapted
                  by a qualified legal professional for the applicable
                  jurisdiction and business model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  icon,
  number,
  title,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="bg-muted text-text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </div>

      <div>
        <p className="text-text-secondary text-xs font-medium tracking-wider uppercase">
          Section {number}
        </p>

        <h2 className="text-text-primary text-2xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}
