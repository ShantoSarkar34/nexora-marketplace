import { apiClient } from "@/lib/api-client";

// What POST /uploads/sign returns: everything the browser needs to upload one
// file straight to the storage service.
export interface SignedUpload {
  uploadUrl: string;
  // The form field the file itself must be sent under.
  fileFieldName: string;
  fields: Record<string, string | number | boolean>;
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

// Five minutes covers a 10 MB file on a slow connection.
const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;

export const uploadsService = {
  // The server checks type and size before it signs, and only lets a
  // freelancer with an ACTIVE contract upload.
  signSubmission: async (file: {
    fileName: string;
    mimeType: string;
    size: number;
  }): Promise<SignedUpload> => {
    const res = await apiClient.post<SignedUpload>("/uploads/sign", {
      purpose: "submission",
      ...file,
    });

    const signed = res.data;
    if (!signed?.uploadUrl || !signed.fileFieldName || !signed.fields) {
      throw new UploadError("The upload service returned an unexpected answer.");
    }
    return signed;
  },
};

// Sends one file to the storage service with the signed fields from the server.
// It uses XMLHttpRequest because fetch can't report upload progress.
export function uploadToStorage(
  signed: SignedUpload,
  file: File,
  options: { signal?: AbortSignal; onProgress?: (percent: number) => void } = {},
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) {
      reject(new UploadError("Upload cancelled."));
      return;
    }
    if (!isHttpsUrl(signed.uploadUrl)) {
      reject(new UploadError("The upload address was not valid."));
      return;
    }

    const form = new FormData();
    for (const [key, value] of Object.entries(signed.fields)) {
      form.append(key, String(value));
    }
    // The file goes last: the signed fields are read first.
    form.append(signed.fileFieldName, file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", signed.uploadUrl);
    // No custom headers and no credentials on purpose. Either would break the
    // signature or the cross-origin request.
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      options.onProgress?.(
        Math.min(100, Math.round((event.loaded / event.total) * 100)),
      );
    };

    xhr.onload = () => {
      let body: {
        secure_url?: string;
        url?: string;
        error?: { message?: string };
      } | null = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        const url = body?.secure_url ?? body?.url;
        if (isHttpsUrl(url)) {
          resolve({ url });
        } else {
          reject(new UploadError("The upload finished, but no file link came back."));
        }
        return;
      }

      reject(
        new UploadError(body?.error?.message ?? "The file couldn't be uploaded."),
      );
    };

    xhr.onerror = () =>
      reject(
        new UploadError(
          "The upload was interrupted. Check your connection and try again.",
        ),
      );
    xhr.ontimeout = () =>
      reject(new UploadError("The upload took too long. Try again."));
    xhr.onabort = () => reject(new UploadError("Upload cancelled."));

    options.signal?.addEventListener("abort", () => xhr.abort(), { once: true });

    xhr.send(form);
  });
}