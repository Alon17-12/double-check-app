"use client";

import { AppShell } from "@/components/shared/AppShell";

export default function InboxPage() {
  return (
    <AppShell>
      <div className="bg-surface px-4 py-4 border-b border-border">
        <h1 className="text-lg font-bold text-navy">📨 Inbox Magic</h1>
      </div>
      <div className="px-6 py-16 text-center">
        <div className="text-5xl mb-4">📨</div>
        <h2 className="text-xl font-bold text-navy mb-2">ייבנה ב-Phase 2</h2>
        <p className="text-sm text-text-sub leading-relaxed">
          כתובת ייחודית, QR code, היסטוריית מיילים שנקלטו, ספקים נתמכים.
        </p>
      </div>
    </AppShell>
  );
}
