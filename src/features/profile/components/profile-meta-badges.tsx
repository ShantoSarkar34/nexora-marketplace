import { Badge } from "@/components/ui/badge";
import {
  availabilityLabels,
  experienceLevelLabels,
  type Availability,
  type ExperienceLevel,
} from "@/types/enums";

const availabilityVariant: Record<
  Availability,
  "success" | "warning" | "neutral"
> = {
  AVAILABLE: "success",
  BUSY: "warning",
  NOT_AVAILABLE: "neutral",
};

interface ProfileMetaBadgesProps {
  availability?: Availability | null;
  experienceLevel?: ExperienceLevel | null;
}

export function ProfileMetaBadges({
  availability,
  experienceLevel,
}: ProfileMetaBadgesProps) {
  if (!availability && !experienceLevel) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {availability && (
        <Badge variant={availabilityVariant[availability]}>
          {availabilityLabels[availability]}
        </Badge>
      )}
      {experienceLevel && (
        <Badge variant="brand">{experienceLevelLabels[experienceLevel]}</Badge>
      )}
    </div>
  );
}
