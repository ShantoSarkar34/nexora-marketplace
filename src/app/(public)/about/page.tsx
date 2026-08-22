export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1>About Nexora</h1>
      <p className="text-text-secondary mt-6">
        Nexora exists because most freelance marketplaces are search engines,
        not matchmakers. Freelancers scroll through hundreds of listings hoping
        something fits. Clients wade through applicants hoping one of them can
        actually do the job. Neither side gets a real signal until the work has
        already started.
      </p>
      <p className="text-text-secondary mt-4">
        We built Nexora around a simple idea: skills and requirements can be
        compared directly. Before a freelancer applies, they see how their
        profile lines up with a job — what matches, what&apos;s missing, and
        what would improve their chances. Before a client reviews an applicant,
        they see the same thing in reverse.
      </p>
      <p className="text-text-secondary mt-4">
        This is a full-stack project built to explore that idea end to end —
        from matching logic to contracts, payments, and reputation.
      </p>
    </div>
  );
}
