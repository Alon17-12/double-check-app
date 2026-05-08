"use client";

import { AppShell } from "@/components/shared/AppShell";
import { useDeliveryStore } from "@/lib/stores/delivery-store";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const reset = useDeliveryStore((s) => s.resetMockData);

  return (
    <AppShell>
      <div className="bg-surface px-4 py-4 border-b border-border">
        <h1 className="text-lg font-bold text-navy">⚙️ הגדרות</h1>
      </div>
      <div className="px-4 py-6 space-y-3">
        <div className="bg-surface border border-border rounded-[16px] p-4">
          <div className="text-sm font-bold text-navy mb-1">פרופיל</div>
          <div className="text-xs text-text-sub">אלון גבאי • alon@alon-gabay.co.il</div>
        </div>

        <div className="bg-surface border border-border rounded-[16px] p-4">
          <div className="text-sm font-bold text-navy mb-2">Phase 1 (MVP) — Frontend Only</div>
          <div className="text-xs text-text-sub leading-relaxed mb-3">
            כל הנתונים נשמרים ב-localStorage. אין עדיין Supabase / Gemini / Cloudflare. ההתחברויות יתווספו בשלבים הבאים.
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              reset();
              alert("הנתונים אופסו לברירת המחדל");
            }}
          >
            איפוס נתונים
          </Button>
        </div>

        <div className="text-center text-text-muted text-xs pt-6">
          Double Check v0.1.0 · Phase 1
        </div>
      </div>
    </AppShell>
  );
}
