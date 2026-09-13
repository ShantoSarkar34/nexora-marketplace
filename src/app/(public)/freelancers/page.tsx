import { Search } from "lucide-react";

export default function FindTalentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Search className="h-7 w-7" />
      </div>
      <h1 className="mt-6">Find Talent</h1>
      <p className="mt-3 text-text-secondary">
        A searchable freelancer directory is coming soon. In the meantime, freelancer profiles
        are visible from job applications and contracts once you&apos;re working together.
      </p>
    </div>
  );
}