"use client";

import { useState } from "react";

export function InviteButton({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const link = `${window.location.origin}/v/${inviteCode}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt("Copy your valley's invite link:", link);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      title="Copy this valley's invite link"
      className="btn-glow rounded-full px-4 py-1 font-display text-[11px] font-semibold tracking-[0.15em]"
    >
      {copied ? "COPIED ✦" : "INVITE"}
    </button>
  );
}
