"use client";

import { Avatar } from "@/components/shared/avatar";
import { useUserAvatar } from "@/hooks/use-user-avatar";

interface UserAvatarProps {
  userId: string;
  role: "FREELANCER" | "CLIENT";
  name: string;
  size?: "sm" | "md" | "lg";
  accent?: "brand" | "freelancer" | "client";
}

export function UserAvatar({
  userId,
  role,
  name,
  size,
  accent,
}: UserAvatarProps) {
  const { data: imageUrl } = useUserAvatar(userId, role);
  // console.log(imageUrl)
  return (
    <Avatar
      name={name}
      imageUrl={imageUrl ?? undefined}
      size={size}
      accent={accent}
    />
  );
}
