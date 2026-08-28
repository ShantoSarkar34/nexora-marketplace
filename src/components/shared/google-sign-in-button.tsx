"use client";

import { useEffect, useRef, useState } from "react";
import { env } from "@/lib/env";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  onToken,
}: {
  onToken: (idToken: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;
    if (window.google) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.google || !containerRef.current) return;
    if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

    window.google.accounts.id.initialize({
      client_id: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => onToken(response.credential),
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "continue_with",
    });
  }, [scriptLoaded, onToken]);

  if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <p className="border-border text-text-secondary rounded-md border border-dashed p-3 text-center text-xs">
        Google sign-in isn&apos;t configured yet — add{" "}
        <code className="bg-surface-muted rounded px-1 py-0.5">
          NEXT_PUBLIC_GOOGLE_CLIENT_ID
        </code>{" "}
        to enable it.
      </p>
    );
  }

  return <div ref={containerRef} className="flex w-full justify-center" />;
}
