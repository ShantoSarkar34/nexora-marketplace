"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Paperclip,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCEPT_ATTRIBUTE,
  ALLOWED_TYPES_LABEL,
  MAX_ATTACHMENTS,
  MAX_FILE_SIZE,
  fileKey,
  formatFileSize,
  mimeTypeFor,
  safeFileName,
  uploadFailureMessage,
  validateFile,
} from "@/features/contracts/attachments";
import { FileTypeIcon } from "@/features/contracts/components/file-type-icon";
import { safeHttpUrl } from "@/features/contracts/utils";
import { authQueryKey } from "@/hooks/use-auth";
import { useSubmitWork } from "@/hooks/use-contracts";
import { ApiError, isSuspendedError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { uploadsService, uploadToStorage } from "@/services/uploads";
import type { ContractAttachment } from "@/types/contract";

interface UploadItem {
  id: string;
  key: string;
  file: File;
  name: string;
  mimeType: string;
  status: "uploading" | "done" | "error";
  progress: number;
  attachment?: ContractAttachment;
  error?: string;
}

export function SubmitWorkCard({ contractId }: { contractId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const submitWork = useSubmitWork();

  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [rejections, setRejections] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);

  // The ref is the source of truth for the file list, so several quick changes
  // (a progress event right after a drop) never read stale state.
  const itemsRef = useRef<UploadItem[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Leaving the page cancels uploads that are still running.
  useEffect(() => {
    const active = controllers.current;
    return () => {
      active.forEach((controller) => controller.abort());
    };
  }, []);

  function updateItems(updater: (previous: UploadItem[]) => UploadItem[]) {
    const next = updater(itemsRef.current);
    if (next === itemsRef.current) return;
    itemsRef.current = next;
    setItems(next);
  }

  function patchItem(id: string, changes: Partial<UploadItem>) {
    updateItems((previous) => {
      const target = previous.find((item) => item.id === id);
      if (!target) return previous;

      const changed = (Object.keys(changes) as (keyof UploadItem)[]).some(
        (field) => target[field] !== changes[field],
      );
      if (!changed) return previous;

      return previous.map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      );
    });
  }

  async function startUpload(item: UploadItem) {
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    patchItem(item.id, { status: "uploading", progress: 0, error: undefined });

    try {
      const signed = await uploadsService.signSubmission({
        fileName: item.name,
        mimeType: item.mimeType,
        size: item.file.size,
      });
      // The file was removed while the server was signing.
      if (controller.signal.aborted) return;

      const { url: fileUrl } = await uploadToStorage(signed, item.file, {
        signal: controller.signal,
        onProgress: (progress) => patchItem(item.id, { progress }),
      });

      patchItem(item.id, {
        status: "done",
        progress: 100,
        attachment: {
          url: fileUrl,
          name: item.name,
          size: item.file.size,
          mimeType: item.mimeType,
        },
      });
    } catch (error) {
      // The user removed the file, so there is nothing to report.
      if (controller.signal.aborted) return;

      if (isSuspendedError(error)) {
        router.replace("/suspended");
        return;
      }
      if (error instanceof ApiError && error.status === 401) {
        void qc.invalidateQueries({ queryKey: authQueryKey });
      }
      patchItem(item.id, {
        status: "error",
        error: uploadFailureMessage(error),
      });
    } finally {
      controllers.current.delete(item.id);
    }
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const known = new Set(itemsRef.current.map((item) => item.key));
    let slots = MAX_ATTACHMENTS - itemsRef.current.length;
    const problems: string[] = [];
    const accepted: UploadItem[] = [];

    for (const file of Array.from(fileList)) {
      const problem = validateFile(file);
      if (problem) {
        problems.push(`${file.name}: ${problem}`);
        continue;
      }

      const key = fileKey(file);
      if (known.has(key)) {
        problems.push(`${file.name}: already added`);
        continue;
      }
      if (slots <= 0) {
        problems.push(
          `${file.name}: you can attach up to ${MAX_ATTACHMENTS} files`,
        );
        continue;
      }

      known.add(key);
      slots -= 1;
      accepted.push({
        id: `upload-${nextId.current++}`,
        key,
        file,
        name: safeFileName(file.name),
        // validateFile already confirmed the extension maps to a type.
        mimeType: mimeTypeFor(file.name) ?? "application/octet-stream",
        status: "uploading",
        progress: 0,
      });
    }

    setRejections(problems);
    if (accepted.length === 0) return;

    setFilesError(null);
    updateItems((previous) => [...previous, ...accepted]);
    accepted.forEach((item) => void startUpload(item));
  }

  function removeItem(id: string) {
    controllers.current.get(id)?.abort();
    updateItems((previous) => previous.filter((item) => item.id !== id));
    setFilesError(null);
  }

  function retryItem(id: string) {
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (item) void startUpload(item);
  }

  async function handleSubmit() {
    const trimmedNote = note.trim();
    const trimmedUrl = url.trim();

    setNoteError(null);
    setUrlError(null);
    setFilesError(null);

    if (items.some((item) => item.status === "uploading")) {
      toast.info("Wait for your files to finish uploading.");
      return;
    }
    if (items.some((item) => item.status === "error")) {
      setFilesError(
        "Retry or remove the files that failed to upload before submitting.",
      );
      return;
    }

    const attachments = items.flatMap((item) =>
      item.attachment ? [item.attachment] : [],
    );

    if (!trimmedNote && !trimmedUrl && attachments.length === 0) {
      toast.error("Add a note, a link, or a file before submitting.");
      return;
    }
    if (trimmedUrl && !safeHttpUrl(trimmedUrl)) {
      setUrlError("Enter a full link starting with http:// or https://");
      return;
    }

    try {
      await submitWork.mutateAsync({
        contractId,
        submissionNote: trimmedNote || undefined,
        submissionUrl: trimmedUrl || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      toast.success("Work submitted for review.");
      setNote("");
      setUrl("");
      setRejections([]);
      updateItems(() => []);
    } catch (error) {
      // Anything else is toasted globally.
      if (error instanceof ApiError && error.errors) {
        setNoteError(error.errors.submissionNote?.[0] ?? null);
        setUrlError(error.errors.submissionUrl?.[0] ?? null);

        // Keys look like `attachments` or `attachments.0.url`.
        const fileMessage = Object.entries(error.errors)
          .filter(
            ([key]) => key === "attachments" || key.startsWith("attachments."),
          )
          .map(([, messages]) => messages[0])
          .find(Boolean);
        if (fileMessage) setFilesError(fileMessage);
      }
    }
  }

  const isUploading = items.some((item) => item.status === "uploading");
  const isFull = items.length >= MAX_ATTACHMENTS;

  return (
    <Card>
      <h3>Submit completed work</h3>

      <div className="mt-3 space-y-4">
        <div>
          <Label htmlFor="submission-note">Note</Label>
          <Textarea
            id="submission-note"
            rows={4}
            placeholder="Describe what you've completed..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {noteError && (
            <p className="text-status-error mt-1 text-xs">{noteError}</p>
          )}
        </div>

        <div>
          <Label htmlFor="submission-url">Link (optional)</Label>
          <Input
            id="submission-url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {urlError && (
            <p className="text-status-error mt-1 text-xs">{urlError}</p>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Label>Files (optional)</Label>
            <span className="text-text-secondary text-xs">
              {items.length}/{MAX_ATTACHMENTS} files
            </span>
          </div>

          <div
            onDragOver={(e) => {
              if (isFull) return;
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (!isFull) addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "border-border rounded-md border border-dashed p-4 text-center transition-colors",
              dragging && "border-brand-500 bg-brand-500/5",
              isFull && "opacity-60",
            )}
          >
            <Paperclip className="text-text-secondary mx-auto h-5 w-5" />
            <p className="text-text-primary mt-2 text-sm">
              Drag files here or{" "}
              <button
                type="button"
                disabled={isFull}
                onClick={() => inputRef.current?.click()}
                className="text-brand-600 font-medium hover:underline disabled:no-underline"
              >
                choose files
              </button>
            </p>
            <p className="text-text-secondary mt-1 text-xs">
              {ALLOWED_TYPES_LABEL} · up to {formatFileSize(MAX_FILE_SIZE)} each
              · max {MAX_ATTACHMENTS} files
            </p>
            <p className="text-text-secondary mt-1 text-xs">
              Anyone with a file&apos;s link can open it, so don&apos;t upload
              anything sensitive.
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT_ATTRIBUTE}
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                // Lets the same file be chosen again after removing it.
                e.target.value = "";
              }}
            />
          </div>

          {rejections.length > 0 && (
            <ul className="text-status-error mt-2 space-y-0.5 text-xs">
              {rejections.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-border rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileTypeIcon
                      mimeType={item.mimeType}
                      className="text-text-secondary h-5 w-5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-text-primary truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {formatFileSize(item.file.size)}
                        {item.status === "uploading" &&
                          ` · Uploading ${item.progress}%`}
                        {item.status === "done" && " · Uploaded"}
                      </p>
                    </div>

                    {item.status === "done" && (
                      <CheckCircle2 className="text-status-active h-4 w-4 shrink-0" />
                    )}
                    {item.status === "error" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => retryItem(item.id)}
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        Retry
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-text-secondary hover:text-status-error shrink-0 rounded p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {item.status === "uploading" && (
                    <div
                      role="progressbar"
                      aria-label={`Uploading ${item.name}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={item.progress}
                      className="bg-surface-muted mt-2 h-1.5 overflow-hidden rounded-full"
                    >
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {item.status === "error" && item.error && (
                    <p className="text-status-error mt-2 flex items-start gap-1.5 text-xs">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {item.error}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {filesError && (
            <p className="text-status-error mt-2 text-xs">{filesError}</p>
          )}
        </div>
      </div>

      <Button
        className="mt-4"
        onClick={handleSubmit}
        isLoading={submitWork.isPending}
        disabled={isUploading}
      >
        {isUploading ? "Uploading files..." : "Submit Work"}
      </Button>
    </Card>
  );
}
