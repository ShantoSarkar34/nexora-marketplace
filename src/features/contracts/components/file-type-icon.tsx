import {
  File as GenericFileIcon,
  FileArchive,
  FileImage,
  FileText,
} from "lucide-react";

export function FileTypeIcon({
  mimeType,
  className,
}: {
  mimeType: string;
  className?: string;
}) {
  const type = mimeType ?? "";

  if (type.startsWith("image/")) return <FileImage className={className} />;
  if (type.includes("zip")) return <FileArchive className={className} />;
  if (
    type === "application/pdf" ||
    type === "text/plain" ||
    type.includes("wordprocessingml")
  ) {
    return <FileText className={className} />;
  }
  return <GenericFileIcon className={className} />;
}
