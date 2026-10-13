"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Nexora?",
    answer:
      "Nexora is a freelance and job marketplace designed to connect clients with skilled professionals. Clients can discover talent and manage projects, while freelancers can explore opportunities and apply for jobs.",
  },
  {
    question: "How do I get started as a freelancer?",
    answer:
      "Create an account, complete your freelancer profile, add your skills and experience, and browse available jobs. When you find a suitable opportunity, you can submit an application.",
  },
  {
    question: "How can I hire a freelancer?",
    answer:
      "Create a client account, publish a job with your project requirements, and review applications from interested freelancers. You can then choose the right candidate for your project.",
  },
  {
    question: "Is Nexora free to join?",
    answer:
      "You can create an account and explore the platform. Any applicable service fees or payment terms will depend on the features and policies available on Nexora.",
  },
  {
    question: "How does Nexora's AI matching work?",
    answer:
      "Nexora is designed to help users discover relevant opportunities and talent based on skills and project requirements. AI-powered matching is still being developed, so the current experience may not include fully functional AI recommendations.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Nexora is designed to support a structured project payment workflow. Before starting a project, review the available payment options and terms shown on the platform.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Section introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">
            Got questions?
          </span>

          <h2 className="text-text-primary mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to know about Nexora
          </h2>

          <p className="text-text-secondary mt-4 max-w-md text-base leading-7">
            New to Nexora? Find answers to common questions about getting
            started, finding work, hiring talent, and using the platform.
          </p>

          <p className="text-text-secondary mt-6 text-sm">
            Still have questions?{" "}
            <a
              href="mailto:support@nexora.com"
              className="text-brand-600 font-medium underline underline-offset-4"
            >
              Contact our team
            </a>
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="divide-border divide-y">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="border-border border-b last:border-b-0"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="text-text-primary hover:text-brand-600 flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium transition-colors sm:text-lg"
                >
                  <span>{faq.question}</span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "text-brand-600 rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-text-secondary max-w-2xl pb-5 text-sm leading-7 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
