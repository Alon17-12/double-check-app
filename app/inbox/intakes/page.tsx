import Link from "next/link";
import { Settings as SettingsIcon } from "lucide-react";
import { AppShell, BackButton } from "@/components/shared/AppShell";
import { getUserInbox, listIntakes } from "@/lib/data/inbox";
import { IntakesFilters } from "./IntakesFilters";

export default async function IntakesPage() {
  const inbox = await getUserInbox();
  const intakes = await listIntakes();

  return (
    <AppShell>
      <header className="bg-surface px-4 py-3.5 border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <BackButton href="/inbox" />
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-navy flex items-center gap-1.5">📨 מיילים שנקלטו</h1>
            <p className="text-[11px] text-text-sub">היסטוריית פיענוח של Inbox Magic</p>
          </div>
          <Link href="/inbox" aria-label="הגדרות" className="w-9 h-9 rounded-[10px] bg-bg text-navy flex items-center justify-center">
            <SettingsIcon size={20} strokeWidth={2} />
          </Link>
        </div>
        {inbox && (
          <div className="bg-bg rounded-lg px-3 py-2 flex items-center gap-2 text-[11px] text-text-sub">
            <span>📬</span>
            <code className="font-display text-navy font-semibold flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {inbox.inboxFull}
            </code>
          </div>
        )}
      </header>

      {intakes.length === 0 ? <EmptyState /> : <IntakesFilters intakes={intakes} />}
      <div className="h-6" />
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="text-5xl mb-3">📥</div>
      <h3 className="text-[15px] font-bold text-navy mb-1.5">אין מיילים שנקלטו עדיין</h3>
      <p className="text-[12px] text-text-sub leading-relaxed mb-4">
        העבר את אישור ההזמנה הראשון לכתובת ה-Inbox Magic שלך,
        <br />
        והוא יופיע כאן תוך 5 שניות.
      </p>
      <Link href="/inbox" className="inline-flex items-center gap-1.5 bg-navy text-white px-4 py-2.5 rounded-[12px] text-sm font-semibold">
        ← חזרה ל-Inbox Magic
      </Link>
    </div>
  );
}
