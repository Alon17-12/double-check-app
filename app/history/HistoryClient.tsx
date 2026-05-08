"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { storeLogos } from "@/lib/mocks/data";
import { formatRelativeDate, formatILS, cn } from "@/lib/utils";
import type { Delivery } from "@/lib/types";

type Filter = "all" | "email" | "photo" | "foreign" | "issues";

export function HistoryClient({ deliveries }: { deliveries: Delivery[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const stats = {
    total: deliveries.length,
    completedPercent:
      deliveries.length > 0
        ? Math.round(
            (deliveries.filter((d) => d.status === "completed" || d.status === "refunded").length /
              deliveries.length) *
              100,
          )
        : 0,
    withIssues: deliveries.filter((d) => hasIssues(d)).length,
    refunds: Math.round(deliveries.reduce((s, d) => s + (d.refundAmount ?? 0), 0)),
  };

  const filtered = deliveries.filter((d) => {
    if (query && !d.storeName.includes(query) && !d.orderNumber.includes(query)) return false;
    if (filter === "email") return d.source === "email";
    if (filter === "photo") return d.source === "photo";
    if (filter === "foreign") return d.currency !== "ILS";
    if (filter === "issues") return hasIssues(d);
    return true;
  });

  const groups = groupByPeriod(filtered);

  return (
    <>
      <header className="bg-surface px-4 pt-4 pb-3 border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 text-[18px] font-bold text-navy">היסטוריית משלוחים</div>
          <button className="w-9 h-9 rounded-[10px] bg-bg text-navy flex items-center justify-center" aria-label="סינון">
            <SlidersHorizontal size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="bg-bg rounded-[12px] flex items-center gap-2 px-3.5 py-2.5">
          <Search size={18} className="text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש לפי חנות, מספר הזמנה..."
            className="flex-1 bg-transparent text-[13px] text-text-main outline-none placeholder:text-text-muted"
          />
        </div>
      </header>

      {deliveries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-4 px-4 py-3 bg-surface border-b border-border gap-1.5">
            <Stat value={stats.total} label="סך משלוחים" />
            <Stat value={`${stats.completedPercent}%`} label="תקינים" tone="green" />
            <Stat value={stats.withIssues} label="עם פערים" tone="coral" />
            <Stat value={`₪${stats.refunds}`} label="סך החזרים" />
          </div>

          <div className="flex gap-1.5 px-4 py-3 overflow-x-auto no-scrollbar">
            <Pill active={filter === "all"} onClick={() => setFilter("all")} label="הכל" count={deliveries.length} />
            <Pill active={filter === "email"} onClick={() => setFilter("email")} label="📨 ממייל" count={deliveries.filter((d) => d.source === "email").length} />
            <Pill active={filter === "photo"} onClick={() => setFilter("photo")} label="📷 צילום" count={deliveries.filter((d) => d.source === "photo").length} />
            <Pill active={filter === "foreign"} onClick={() => setFilter("foreign")} label="🌎 חו״ל" count={deliveries.filter((d) => d.currency !== "ILS").length} />
            <Pill active={filter === "issues"} onClick={() => setFilter("issues")} label="פערים" count={deliveries.filter(hasIssues).length} />
          </div>

          {filtered.length === 0 && <div className="text-center text-text-sub py-12">לא נמצאו משלוחים</div>}

          {Object.entries(groups).map(([period, items]) => (
            <section key={period}>
              <div className="px-4 pt-3 pb-1.5 text-[11px] font-bold text-text-sub uppercase tracking-wider">
                {period}
              </div>
              <div className="px-3 flex flex-col gap-2">
                {items.map((d) => (
                  <DeliveryRow key={d.id} delivery={d} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <div className="h-6" />
    </>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="text-5xl mb-3">📜</div>
      <h3 className="text-[15px] font-bold text-navy mb-1.5">אין היסטוריה עדיין</h3>
      <p className="text-[12px] text-text-sub leading-relaxed mb-4">
        אחרי שתבדוק את המשלוח הראשון, הוא יופיע כאן יחד עם כל היתר.
      </p>
      <Link
        href="/delivery/new"
        className="inline-flex items-center gap-1.5 bg-navy text-white px-4 py-2.5 rounded-[12px] text-sm font-semibold"
      >
        📷 צלם קבלה ראשונה
      </Link>
    </div>
  );
}

function Stat({ value, label, tone }: { value: string | number; label: string; tone?: "green" | "coral" }) {
  const toneClass = tone === "green" ? "text-green" : tone === "coral" ? "text-coral" : "text-navy";
  return (
    <div className="text-center px-1 py-1.5">
      <div className={cn("font-display text-[18px] font-bold", toneClass)}>{value}</div>
      <div className="text-[10px] text-text-sub mt-0.5">{label}</div>
    </div>
  );
}

function Pill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors flex items-center gap-1.5",
        active ? "bg-navy text-white border border-navy" : "bg-surface text-text-sub border border-border",
      )}
    >
      {label}
      <span className={cn("text-[10px] font-display rounded-full px-1.5", active ? "bg-white/20" : "bg-black/[0.06]")}>
        {count}
      </span>
    </button>
  );
}

function DeliveryRow({ delivery }: { delivery: Delivery }) {
  const logo = storeLogos[delivery.storeId] ?? {
    initials: delivery.storeName.slice(0, 2).toUpperCase(),
    gradient: "from-slate-500 to-slate-700",
  };
  const issues = hasIssues(delivery);
  const refunded = delivery.status === "refunded";
  const accent = refunded ? "after:bg-green" : issues ? "after:bg-coral" : "after:bg-transparent";

  return (
    <Link
      href={`/delivery/${delivery.id}`}
      className={cn(
        "bg-surface border border-border rounded-[12px] p-3 flex gap-3 relative overflow-hidden cursor-pointer hover:border-cyan hover:shadow-sm transition",
        "after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[3px]",
        accent,
      )}
    >
      <div className={cn("w-11 h-11 rounded-[12px] bg-gradient-to-br flex items-center justify-center text-white font-display font-bold text-[13px] flex-shrink-0", logo.gradient)}>
        {logo.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-[13px] font-semibold text-navy flex-1 truncate">
            {delivery.storeName} {delivery.orderNumber ? `— #${delivery.orderNumber.slice(-6)}` : ""}
          </div>
          <SourceBadge source={delivery.source} />
        </div>
        <div className="text-[11px] text-text-sub flex gap-2 items-center mb-1.5">
          <span>📅 {formatRelativeDate(delivery.orderDate)}</span>
          <span>🛒 {delivery.items.length} פריטים</span>
          {delivery.currency !== "ILS" && <span>🌎 {delivery.currency}</span>}
        </div>
        <div className="flex justify-between items-center">
          <StatusBadge delivery={delivery} />
          <div className="font-display font-bold text-[14px] text-navy">
            {delivery.currency === "ILS" ? formatILS(delivery.ilsTotal) : `$${delivery.originalTotal.toFixed(2)}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SourceBadge({ source }: { source: Delivery["source"] }) {
  const map: Record<Delivery["source"], { label: string; className: string }> = {
    photo: { label: "📷 צילום", className: "bg-text-muted/15 text-text-sub" },
    email: { label: "📨 מייל", className: "bg-cyan/15 text-[#0369a1]" },
    extension: { label: "🧩 תוסף", className: "bg-cyan/15 text-cyan" },
    manual: { label: "✏️ ידני", className: "bg-text-muted/15 text-text-sub" },
  };
  const cfg = map[source];
  return (
    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap", cfg.className)}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ delivery }: { delivery: Delivery }) {
  if (delivery.status === "refunded") {
    return (
      <span className="bg-cyan/15 text-[#0369a1] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
        ✓ החזר{delivery.refundAmount ? ` ${formatILS(delivery.refundAmount)}` : ""} התקבל
      </span>
    );
  }
  if (hasIssues(delivery)) {
    const issueCount = delivery.items.filter(
      (i) => i.status === "missing" || i.status === "partial" || i.status === "damaged",
    ).length;
    return <span className="bg-coral/15 text-[#be123c] px-2.5 py-0.5 rounded-full text-[10px] font-bold">{issueCount} פערים</span>;
  }
  if (delivery.status === "completed") {
    return <span className="bg-green/15 text-[#15803d] px-2.5 py-0.5 rounded-full text-[10px] font-bold">תקין</span>;
  }
  return <span className="bg-yellow/20 text-[#b45309] px-2.5 py-0.5 rounded-full text-[10px] font-bold">בהמתנה</span>;
}

function hasIssues(d: Delivery): boolean {
  return d.items.some((i) => i.status === "missing" || i.status === "partial" || i.status === "damaged");
}

function groupByPeriod(deliveries: Delivery[]): Record<string, Delivery[]> {
  const now = new Date();
  const groups: Record<string, Delivery[]> = {};

  for (const d of deliveries) {
    const date = new Date(d.orderDate);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    let key: string;
    if (diffDays <= 7) key = "השבוע";
    else if (diffDays <= 14) key = "שבוע שעבר";
    else if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) key = "החודש";
    else key = date.toLocaleDateString("he-IL", { month: "long", year: "numeric" });

    if (!groups[key]) groups[key] = [];
    groups[key].push(d);
  }

  return groups;
}
