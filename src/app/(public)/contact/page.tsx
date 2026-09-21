import { ContactCta } from "@/features/contracts/components/contact-cta";
import { ContactFaq } from "@/features/contracts/components/contact-faq";
import { ContactForm } from "@/features/contracts/components/contact-form";
import { ContactHero } from "@/features/contracts/components/contact-hero";
import { ContactInfo } from "@/features/contracts/components/contact-info";

export default function ContactPage() {
  return (
    <main>
      <ContactHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <ContactFaq />
      <ContactCta />
    </main>
  );
}
