import {
  formatFileSize,
  isImageAttachment,
} from "@/features/contracts/attachments";
import { FileTypeIcon } from "@/features/contracts/components/file-type-icon";
import { safeHttpUrl } from "@/features/contracts/utils";
import type { ContractAttachment } from "@/types/contract";

export function AttachmentList({
  attachments,
}: {
  attachments: ContractAttachment[];
}) {
  if (attachments.length === 0) return null;

  const images = attachments.filter(isImageAttachment);
  const files = attachments.filter(
    (attachment) => !isImageAttachment(attachment),
  );

  return (
    <div className="mt-4 space-y-3">
      <p className="text-text-secondary text-xs font-medium">
        Files ({attachments.length})
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => {
            const href = safeHttpUrl(image.url);
            return (
              <figure
                key={`${image.url}-${index}`}
                className="border-border overflow-hidden rounded-md border"
              >
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <img
                      src={href}
                      alt={image.name}
                      loading="lazy"
                      className="bg-surface-muted max-h-56 w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="bg-surface-muted text-text-secondary flex h-32 items-center justify-center text-xs">
                    Preview unavailable
                  </div>
                )}
                <figcaption className="text-text-secondary flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="truncate">{image.name}</span>
                  <span className="shrink-0">{formatFileSize(image.size)}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <ul className="border-border divide-border divide-y rounded-md border">
          {files.map((file, index) => {
            const href = safeHttpUrl(file.url);
            return (
              <li
                key={`${file.url}-${index}`}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <FileTypeIcon
                  mimeType={file.mimeType}
                  className="text-text-secondary h-5 w-5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-brand-600 block truncate text-sm font-medium"
                    >
                      {file.name}
                    </a>
                  ) : (
                    <p className="text-text-primary truncate text-sm font-medium">
                      {file.name}
                    </p>
                  )}
                  <p className="text-text-secondary text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 shrink-0 text-xs font-medium"
                  >
                    Open
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
