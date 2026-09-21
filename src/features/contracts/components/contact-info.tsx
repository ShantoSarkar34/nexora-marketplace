import { Mail, MapPin, Clock3, MessageSquare } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    title: "Email us",
    description: "For general questions and support",
    value: "support@nexora.com",
    href: "mailto:support@nexora.com",
  },
  {
    icon: MessageSquare,
    title: "Support",
    description: "Need help with your Nexora account?",
    value: "support@nexora.com",
    href: "mailto:support@nexora.com",
  },
  {
    icon: MapPin,
    title: "Our location",
    description: "Serving professionals worldwide",
    value: "Bangladesh",
  },
  {
    icon: Clock3,
    title: "Response time",
    description: "We usually respond within",
    value: "1–2 business days",
  },
];

export function ContactInfo() {
  return (
    <div>
      <div>
        <p className="text-brand-600 text-sm font-semibold tracking-wide uppercase">
          Contact Nexora
        </p>

        <h2 className="text-text-primary mt-2 text-2xl font-bold sm:text-3xl">
          We&apos;re here to help
        </h2>

        <p className="text-text-secondary mt-3 max-w-md text-sm leading-6 sm:text-base">
          Whether you&apos;re a freelancer looking for your next project or a
          client searching for the right talent, feel free to reach out.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-4">
              <div className="bg-brand-500/10 text-brand-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-text-primary text-sm font-semibold">
                  {item.title}
                </h3>

                <p className="text-text-secondary mt-0.5 text-xs">
                  {item.description}
                </p>

                {item.href ? (
                  <a
                    href={item.href}
                    className="text-brand-600 mt-1 inline-block text-sm font-medium hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-text-primary mt-1 text-sm font-medium">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
