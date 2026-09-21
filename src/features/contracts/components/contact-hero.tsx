import { MessageCircle } from "lucide-react";

export function ContactHero() {
  return (
    <section className="border-border bg-surface-muted border-b">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <div className="bg-brand-500/10 text-brand-600 mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
          <MessageCircle className="h-6 w-6" />
        </div>

        <p className="text-brand-600 text-sm font-semibold tracking-wide uppercase">
          Get in touch
        </p>

        <h1 className="text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Let&apos;s talk about your next opportunity
        </h1>

        <p className="text-text-secondary mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg">
          Have a question about Nexora, need help with your account, or want to
          report an issue? Our team is here to help.
        </p>
      </div>
    </section>
  );
}
