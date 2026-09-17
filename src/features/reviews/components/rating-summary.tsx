// "use client";

// import { Star } from "lucide-react";

// import { Spinner } from "@/components/ui/spinner";
// import { useUserReviewSummary } from "@/hooks/use-reviews";

// export function RatingSummary({ userId }: { userId: string }) {
//   const { data, isLoading } = useUserReviewSummary(userId);

//   if (isLoading) return <Spinner className="h-4 w-4" />;
//   if (!data || data.totalReviews === 0) {
//     return <p className="text-text-secondary text-sm">No reviews yet</p>;
//   }

//   return (
//     <div className="text-text-secondary flex items-center gap-1.5 text-sm">
//       <span className="text-text-primary font-medium">
//         {data.averageRating.toFixed(1)}
//       </span>
//       <Star className="fill-status-pending text-status-pending h-3.5 w-3.5" />
//       <span>
//         ({data.totalReviews} review{data.totalReviews === 1 ? "" : "s"})
//       </span>
//     </div>
//   );
// }

"use client";

import { Star } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { useUserReviewSummary } from "@/hooks/use-reviews";

export function RatingSummary({ userId }: { userId: string }) {
const { data, isLoading } = useUserReviewSummary(userId);

if (isLoading) return <Spinner className="h-4 w-4" />;

if (!data || data.totalReviews === 0) {
return ( <p className="text-text-secondary text-sm">
No reviews yet </p>
);
}

const rating = data.averageRating;

const fullStars = Math.floor(rating);
const hasHalfStar = rating % 1 >= 0.5;
const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

return ( <div className="text-text-secondary flex items-center gap-1.5 text-sm"> <span className="text-text-primary font-medium">
{rating.toFixed(1)} </span>
  <div className="flex items-center">
    {Array.from({ length: fullStars }).map((_, index) => (
      <Star
        key={`full-${index}`}
        className="h-3.5 w-3.5 fill-status-pending text-status-pending"
      />
    ))}

    {hasHalfStar && (
      <div className="relative h-3.5 w-3.5">
        <Star className="absolute h-3.5 w-3.5 text-brand-600/40" />

        <div className="absolute inset-0 w-1/2 overflow-hidden">
          <Star className="h-3.5 w-3.5 fill-status-pending text-status-pending" />
        </div>
      </div>
    )}

    {Array.from({ length: emptyStars }).map((_, index) => (
      <Star
        key={`empty-${index}`}
        className="h-3.5 w-3.5 text-border"
      />
    ))}
  </div>

  <span>
    ({data.totalReviews} review{data.totalReviews === 1 ? "" : "s"})
  </span>
</div>
);
}

