import { ApiError } from "@/lib/api-client";
import { UploadError } from "@/services/uploads";
import type { ContractAttachment } from "@/types/contract";

export const MAX_ATTACHMENTS = 5;
// 10 MB per file. The server checks the size again before it signs an upload.
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_TYPES_LABEL = "PDF, ZIP, PNG, JPG, DOCX or TXT";
export const ACCEPT_ATTRIBUTE = ".pdf,.zip,.png,.jpg,.jpeg,.docx,.txt";

// The type comes from the file extension. Browsers disagree about some types
// (a ZIP is "application/zip" on one system and "application/x-zip-compressed"
// on another, and some report nothing at all), so the extension is the one
// reliable signal.
const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
};

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 && dot < name.length - 1
    ? name.slice(dot + 1).toLowerCase()
    : "";
}

export function mimeTypeFor(fileName: string): string | null {
  return MIME_BY_EXTENSION[extensionOf(fileName)] ?? null;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;

  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

// Returns why a file can't be attached, or null when it can.
export function validateFile(file: File): string | null {
  if (!mimeTypeFor(file.name)) {
    return `unsupported file type (use ${ALLOWED_TYPES_LABEL})`;
  }
  if (file.size === 0) return "the file is empty";
  if (file.size > MAX_FILE_SIZE) {
    return `larger than ${formatFileSize(MAX_FILE_SIZE)}`;
  }
  return null;
}

const MAX_NAME_LENGTH = 180;

// A very long name could be refused by the server, so shorten it and keep the
// extension.
export function safeFileName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length <= MAX_NAME_LENGTH) return trimmed;

  const ext = extensionOf(trimmed);
  const keep = MAX_NAME_LENGTH - (ext ? ext.length + 1 : 0);
  return `${trimmed.slice(0, keep)}${ext ? `.${ext}` : ""}`;
}

export function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function isImageAttachment(
  attachment: Pick<ContractAttachment, "mimeType">,
): boolean {
  return (attachment.mimeType ?? "").startsWith("image/");
}

// The text shown on a file's row when its upload fails.
export function uploadFailureMessage(error: unknown): string {
  if (error instanceof UploadError) return error.message;

  if (error instanceof ApiError) {
    switch (error.status) {
      case 0:
        return error.message;
      case 401:
        return "Your session has expired. Log in again to upload files.";
      case 403:
        return "Files can only be attached while the contract is active.";
      case 429:
        return "You've reached the hourly upload limit. Try again in about an hour.";
      case 502:
      case 503:
        return "File uploads aren't available right now. Try again later.";
      default:
        // A 400 carries the server's reason, for example a rejected file type.
        return error.message || "The upload couldn't be started. Try again.";
    }
  }

  return "The upload failed. Try again.";
}
