"use client";

import { AppShell } from "@/components/shared/AppShell";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="bg-surface px-4 py-4 border-b border-border">
        <h1 className="text-lg font-bold text-navy">📜 היסטוריית משלוחים</h1>
      </div>
      <Stub title="ייבנה ב-Phase 2" subtitle="כל המשלוחים שלך, פילטרים, חיפוש, statistics" />
    </AppShell>
  );
}

function Stub({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-bold text-navy mb-2">{title}</h2>
      <p className="text-sm text-text-sub leading-relaxed">{subtitle}</p>
    </div>
  );
}
