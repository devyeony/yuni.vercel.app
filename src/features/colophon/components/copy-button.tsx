"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/*
 * Client leaf — a deliberate exception on an otherwise server-rendered page:
 * the zero-friction MCP pitch hinges on one-click copy, and the clipboard
 * only exists in the browser.
 */

export function CopyButton({
  value,
  label,
  copiedLabel,
}: Readonly<{ value: string; label: string; copiedLabel: string }>) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <Button
      variant="outline"
      size="sm"
      aria-live="polite"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard unavailable (permissions, insecure context) — the
          // command stays selectable text right next to the button.
        }
      }}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
