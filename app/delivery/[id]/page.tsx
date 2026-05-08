"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, X, AlertTriangle } from "lucide-react";
import { useDeliveryStore } from "@/lib/stores/delivery-store";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/shared/AppShell";
import { formatILS, formatDate, cn } from "@/lib/utils";
import type { Delivery, DeliveryItem, ItemStatus } from "@/lib/types";

type Filter = "all" | "pending" | "issues" | "ok";

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const delivery = useDeliveryStore((s) => s.getById(id));
  const setItemStatus = useDeliveryStore((s) => s.setItemStatus);
  const progress = useDeliveryStore((s) => s.computeProgress(id));
  const [filter, setFilter] = useState<Filter>("all");

  if (!delivery) return <div className="p-8 text-center">משלוח לא נמצא</div>;

  const filtered = delivery.items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status === "pending";
    if (filter === "issues") return ["missing", "partial", "damaged", "wrong_item"].includes(item.status);
    if (filter === "ok") return item.status === "ok";
    return true;
  });

  const checked = progress.total - progress.pending;

  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-bg pb-[100px] md:my-6 md:rounded-[28px] md:overflow-hidden md:shadow-md md:min-h-[calc(100vh-48px)]">
      {/* HEADER */}
      <header className="bg-surface px-4 py-3 border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="text-[14px] font-bold text-navy truncate">
              {delivery.storeName} — הזמנה #{delivery.orderNumber}
            </h1>
            <p className="text-[11px] text-text-sub">סמן כל פריט שהגיע. נשמר אוטומטית.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="font-display text-[13px] font-bold text-navy min-w-[56px]">
            {checked}/{progress.total}
          </div>
          <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-green to-[#16a34a] rounded-full transition-[width] duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-2 text-[11px] text-text-sub">
          <Stat dot="green" label="תקין" count={progress.ok} />
          <Stat dot="orange" label="חלקי" count={progress.partial} />
          <Stat dot="coral" label="חסר" count={progress.missing} />
          <Stat dot="gray" label="לא נבדק" count={progress.pending} />
        </div>
      </header>

      {/* FOREIGN ORDER INFO */}
      {delivery.currency !== "ILS" && <ForeignOrderBanner delivery={delivery} />}

      {/* FILTERS */}
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto no-scrollbar">
        <Pill active={filter === "all"} onClick={() => setFilter("all")} label="הכל" count={progress.total} />
        <Pill active={filter === "pending"} onClick={() => setFilter("pending")} label="לא נבדקו" count={progress.pending} />
        <Pill active={filter === "issues"} onClick={() => setFilter("issues")} label="בעיות" count={progress.partial + progress.missing + progress.damaged} />
        <Pill active={filter === "ok"} onClick={() => setFilter("ok")} label="תקינים" count={progress.ok} />
      </div>

      {/* ITEMS */}
      <div className="px-3 flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="text-center text-text-sub text-sm py-12">אין פריטים בקטגוריה זו</div>
        )}
        {filtered.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onChange={(status) => setItemStatus(delivery.id, item.id, status)}
          />
        ))}
      </div>

      {/* ACTION BAR */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface px-4 pt-3 border-t border-border z-10"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <Button
          variant="success"
          size="lg"
          onClick={() => router.push(`/delivery/${delivery.id}/summary`)}
          className="w-full"
        >
          <Check size={18} strokeWidth={2.5} />
          סיים בדיקה ({checked}/{progress.total})
        </Button>
      </div>
    </div>
  );
}

function Stat({ dot, label, count }: { dot: "green" | "orange" | "coral" | "gray"; label: string; count: number }) {
  const colors = {
    green: "bg-green",
    orange: "bg-orange",
    coral: "bg-coral",
    gray: "bg-text-muted",
  };
  return (
    <span className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${colors[dot]}`} />
      {count} {label}
    </span>
  );
}

function ForeignOrderBanner({ delivery }: { delivery: Delivery }) {
  const symbol = delivery.currency === "USD" ? "$" : delivery.currency === "EUR" ? "€" : delivery.currency === "GBP" ? "£" : "";
  return (
    <div className="mx-4 mt-3 bg-gradient-to-bl from-orange/10 to-orange/[0.03] border border-orange/30 rounded-[14px] p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">🌎</span>
        <span className="text-[12px] font-bold text-navy">הזמנה מחו״ל</span>
        <span className="text-[10px] font-display bg-orange/20 text-[#c2410c] px-2 py-0.5 rounded-full font-bold">
          {delivery.currency}
        </span>
      </div>
      <div className="flex items-baseline gap-2 text-[14px]">
        <span className="font-display text-navy font-bold">
          {symbol}{delivery.originalTotal.toFixed(2)}
        </span>
        <span className="text-text-muted">≈</span>
        <span className="font-display text-text-sub font-semibold">
          {formatILS(delivery.ilsTotal)}
        </span>
      </div>
      {delivery.exchangeRate && (
        <div className="text-[11px] text-text-sub mt-1.5 flex items-center gap-3 flex-wrap">
          <span>שער {delivery.exchangeRate} ₪/{delivery.currency} ({formatDate(delivery.orderDate)})</span>
          {delivery.expectedEta && <span>📅 ETA {formatDate(delivery.expectedEta)}</span>}
        </div>
      )}
      {(delivery.vatAmount > 0 || (delivery.customsAmount ?? 0) > 0) && (
        <div className="flex gap-2 mt-2.5">
          {delivery.vatAmount > 0 && (
            <div className="flex-1 bg-bg rounded-md py-1.5 text-center">
              <div className="text-[10px] text-text-sub font-semibold">מע״מ ששולם</div>
              <div className="font-display text-[12px] font-bold text-navy">{formatILS(delivery.vatAmount)}</div>
            </div>
          )}
          <div className="flex-1 bg-bg rounded-md py-1.5 text-center">
            <div className="text-[10px] text-text-sub font-semibold">מכס</div>
            <div className={cn("font-display text-[12px] font-bold", (delivery.customsAmount ?? 0) === 0 ? "text-green" : "text-navy")}>
              {(delivery.customsAmount ?? 0) === 0 ? "פטור" : formatILS(delivery.customsAmount ?? 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors flex items-center gap-1.5",
        active
          ? "bg-navy text-white border border-navy"
          : "bg-surface text-text-sub border border-border",
      )}
    >
      {label}
      <span className={cn("text-[10px] font-display", active ? "opacity-70" : "opacity-50")}>{count}</span>
    </button>
  );
}

function ItemRow({ item, onChange }: { item: DeliveryItem; onChange: (s: ItemStatus) => void }) {
  const tone = toneFor(item.status);
  const unitLabel = item.unit === "kg" ? "ק״ג" : item.unit === "liter" ? "ליטר" : "יח׳";

  return (
    <div
      className={cn(
        "border rounded-[12px] p-3 flex items-center gap-3 transition-all relative overflow-hidden",
        tone.bg,
        tone.border,
      )}
    >
      <Checkbox status={item.status} onClick={() => cycleStatus(item.status, onChange)} />
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-[13px] font-medium mb-0.5 truncate",
            item.status === "ok" && "line-through decoration-green/50 decoration-2 text-text-sub",
            item.status === "missing" && "text-coral font-semibold",
          )}
        >
          {item.name}
        </div>
        <div className="text-[11px] text-text-sub flex gap-1.5 items-center">
          {item.status === "missing" ? (
            <>
              חסר • <span className="text-coral font-semibold">{formatILS(item.totalPrice)} להחזר</span>
            </>
          ) : item.status === "partial" ? (
            <>
              הוזמן {item.orderedQty}, הגיע{" "}
              <strong className="text-orange">{item.receivedQty ?? "—"}</strong> • חוסר{" "}
              {formatILS(item.unitPrice * (item.orderedQty - (item.receivedQty ?? 0)))}
            </>
          ) : item.status === "damaged" ? (
            <span className="text-coral">{item.issueNote ?? "פגום"} • {formatILS(item.totalPrice)} להחזר</span>
          ) : (
            <>
              <strong className="font-display text-navy">
                {item.orderedQty} {unitLabel}
              </strong>
              {" "}• {formatILS(item.totalPrice)}
            </>
          )}
        </div>
      </div>

      {(item.status !== "pending" && item.status !== "ok") && (
        <QuickStatus current={item.status} onChange={onChange} />
      )}

      {item.status === "partial" && (
        <div className="bg-orange text-white font-display text-[11px] font-bold px-2 py-[3px] rounded-full">
          {item.receivedQty}/{item.orderedQty}
        </div>
      )}
    </div>
  );
}

function Checkbox({ status, onClick }: { status: ItemStatus; onClick: () => void }) {
  const styles: Record<ItemStatus, string> = {
    pending: "bg-surface border-text-muted",
    ok: "bg-green border-green",
    partial: "bg-orange border-orange",
    missing: "bg-coral border-coral",
    damaged: "bg-yellow border-yellow",
    wrong_item: "bg-coral border-coral",
  };
  return (
    <button
      onClick={onClick}
      aria-label="שנה סטטוס"
      className={cn("w-[30px] h-[30px] border-2 rounded-[9px] flex items-center justify-center flex-shrink-0 transition-colors text-white", styles[status])}
    >
      {status === "ok" && <Check size={16} strokeWidth={3} />}
      {status === "partial" && <Minus size={16} strokeWidth={3} />}
      {(status === "missing" || status === "wrong_item") && <X size={16} strokeWidth={3} />}
      {status === "damaged" && <AlertTriangle size={14} strokeWidth={3} />}
    </button>
  );
}

function QuickStatus({ current, onChange }: { current: ItemStatus; onChange: (s: ItemStatus) => void }) {
  const buttons: Array<{ s: ItemStatus; emoji: string }> = [
    { s: "ok", emoji: "✅" },
    { s: "partial", emoji: "⚠️" },
    { s: "missing", emoji: "❌" },
    { s: "damaged", emoji: "💔" },
  ];
  return (
    <div className="flex gap-1 flex-shrink-0">
      {buttons.map(({ s, emoji }) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          aria-label={s}
          className={cn(
            "w-8 h-8 rounded-[9px] flex items-center justify-center text-sm transition",
            current === s
              ? s === "ok"
                ? "bg-green"
                : s === "partial"
                  ? "bg-orange"
                  : s === "missing"
                    ? "bg-coral"
                    : "bg-yellow"
              : "bg-bg",
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function cycleStatus(current: ItemStatus, onChange: (s: ItemStatus) => void) {
  const order: ItemStatus[] = ["pending", "ok", "partial", "missing", "damaged"];
  const next = order[(order.indexOf(current) + 1) % order.length];
  onChange(next);
}

function toneFor(status: ItemStatus): { bg: string; border: string } {
  switch (status) {
    case "ok":
      return { bg: "bg-green/[0.05]", border: "border-green/25" };
    case "partial":
      return { bg: "bg-orange/[0.05]", border: "border-orange/25" };
    case "missing":
      return { bg: "bg-coral/[0.05]", border: "border-coral/25" };
    case "damaged":
      return { bg: "bg-yellow/[0.05]", border: "border-yellow/30" };
    default:
      return { bg: "bg-surface", border: "border-border" };
  }
}
