import { HelpCircle, ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "What is Nexora?",
    answer:
      "Nexora is a freelance and job marketplace designed to connect clients with skilled freelancers. Clients can discover talent and manage opportunities, while freelancers can showcase their skills and find suitable projects.",
  },
  {
    question: "How can I create an account?",
    answer:
      "You can create an account from the registration page and choose whether you want to join Nexora as a freelancer or client.",
  },
  {
    question: "Is Nexora free to use?",
    answer:
      "Nexora provides access to core marketplace features for registered users. Specific fees or payment-related charges may depend on the service or transaction.",
  },
  {
    question: "How do I report a problem?",
    answer:
      "Send us a message through the contact form with enough information about the issue. Including the affected page and a short description helps us investigate it faster.",
  },
  {
    question: "Can I use Nexora as both a freelancer and a client?",
    answer:
      "Your account role determines the primary marketplace experience available to you. If you need help with your account or role, contact the Nexora support team.",
  },
];

export function ContactFaq() {
  return (
    <section className="bg-surface-muted border-border border-y">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <div className="bg-brand-500/10 text-brand-600 mx-auto flex h-11 w-11 items-center justify-center rounded-xl">
            <HelpCircle className="h-5 w-5" />
          </div>

          <p className="text-brand-600 mt-4 text-sm font-semibold tracking-wide uppercase">
            FAQ
          </p>

          <h2 className="text-text-primary mt-2 text-2xl font-bold sm:text-3xl">
            Frequently asked questions
          </h2>

          <p className="text-text-secondary mx-auto mt-3 max-w-2xl text-sm leading-6 sm:text-base">
            Here are answers to some common questions about Nexora.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-0">
              <details className="group">
                <summary className="text-text-primary flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium">
                  <span>{faq.question}</span>

                  <ChevronDown className="text-text-secondary h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>

                <div className="text-text-secondary px-5 pb-5 text-sm leading-6">
                  {faq.answer}
                </div>
              </details>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
