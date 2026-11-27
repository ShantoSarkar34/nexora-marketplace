import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AboutSectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function AboutSectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: AboutSectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <p className="text-brand-600 text-[11px] font-semibold tracking-[0.2em] uppercase sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="text-text-primary mt-3 text-3xl leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-text-secondary mt-4 text-base leading-7 text-pretty sm:text-lg sm:leading-8",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
