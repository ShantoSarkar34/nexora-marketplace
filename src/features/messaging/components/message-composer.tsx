"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_LENGTH = 2000;
const COUNTER_FROM = 1800;

interface MessageComposerProps {
  // Resolves true when the message was sent, so the box is only cleared then.
  onSend: (body: string) => Promise<boolean>;
  isSending: boolean;
}

export function MessageComposer({ onSend, isSending }: MessageComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow with the text, up to a cap.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  async function submit() {
    const body = value.trim();
    if (!body || isSending) return;

    const sent = await onSend(body);
    if (sent) {
      setValue("");
      textareaRef.current?.focus();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="border-border border-t p-3"
    >
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          placeholder="Write a message..."
          aria-label="Message"
          className="max-h-40 min-h-10 resize-none"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // isComposing keeps Enter from sending while an input method
            // (for example Bangla phonetic typing) is still choosing a word.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              void submit();
            }
          }}
        />
        <Button
          type="submit"
          className="shrink-0 px-3"
          disabled={isSending || !value.trim()}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="text-text-secondary mt-1.5 flex items-center justify-between text-xs">
        <span className="hidden sm:inline">
          Enter to send · Shift+Enter for a new line
        </span>
        {value.length >= COUNTER_FROM && (
          <span className="ml-auto">
            {value.length}/{MAX_LENGTH}
          </span>
        )}
      </div>
    </form>
  );
}