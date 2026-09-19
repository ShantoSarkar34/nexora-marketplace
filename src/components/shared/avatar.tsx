import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/get-initials";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  accent?: "brand" | "freelancer" | "client";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

const accentClasses = {
  brand: "bg-brand-100 text-brand-700",
  freelancer: "bg-freelancer-500/10 text-freelancer-500",
  client: "bg-client-500/10 text-client-500",
};

export function Avatar({
  name,
  imageUrl,
  size = "md",
  accent = "brand",
}: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", sizeClasses[size])}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizeClasses[size],
        accentClasses[accent],
      )}
    >
      {getInitials(name)}
    </span>
  );
}
