"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Inbox Magic", text: address });
        return;
      } catch {
        /* user cancelled */
      }
    }
    onCopy();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={onCopy}
        className="flex-1 bg-cyan text-white py-3 rounded-[12px] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
      >
        {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.5} />}
        {copied ? "הועתק!" : "העתק"}
      </button>
      <button
        onClick={onShare}
        className="flex-1 bg-navy text-white py-3 rounded-[12px] font-semibold text-[13px] flex items-center justify-center gap-1.5"
      >
        <Share2 size={14} strokeWidth={2.5} />
        שלח לעצמי
      </button>
    </div>
  );
}
