import Link from "next/link";

const footerLinks = {
  Product: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/freelancers", label: "Find Talent" },
    { href: "/about", label: "How it Works" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-text-primary">
              Nex<span className="text-brand-600">ora</span>
            </span>
            <p className="mt-2 text-sm text-text-secondary">
              AI-matched freelance work, built on real skills.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-text-primary">
                {section}
              </h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-text-secondary">
          © {new Date().getFullYear()} Nexora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}