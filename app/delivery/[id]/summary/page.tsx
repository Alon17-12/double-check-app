"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileSpreadsheet, Save, Mail } from "lucide-react";
import { useDeliveryStore, computeProgress, computeRefund } from "@/lib/stores/delivery-store";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/shared/AppShell";
import { formatILS } from "@/lib/utils";
import type { DeliveryItem } from "@/lib/types";

export default function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const delivery = useDeliveryStore((s) => s.deliveries.find((d) => d.id === id) ?? null);
  const refund = useMemo(() => computeRefund(delivery), [delivery]);
  const progress = useMemo(() => computeProgress(delivery), [delivery]);

  if (!delivery) return <div className="p-8 text-center">משלוח לא נמצא</div>;

  const missing = delivery.items.filter((i) => i.status === "missing");
  const partial = delivery.items.filter((i) => i.status === "partial");
  const damaged = delivery.items.filter((i) => i.status === "damaged");
  const wrongItems = delivery.items.filter((i) => i.status === "wrong_item");

  const issueCount = missing.length + partial.length + damaged.length + wrongItems.length;
  const refundPct = ((refund / delivery.ilsTotal) * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-bg pb-[100px] md:my-6 md:rounded-[28px] md:overflow-hidden md:shadow-md md:min-h-[calc(100vh-48px)]">
      {/* HERO */}
      <div className="relative bg-gradient-to-br from-navy via-navy-light to-cyan text-white px-5 pt-6 pb-16 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-white/[0.08]" />
        <div className="relative">
          <BackButton />
          <div className="w-16 h-16 rounded-[18px] bg-white/[0.18] backdrop-blur-md mt-3 mb-3 flex items-center justify-center">
            <CheckCircle2 size={32} strokeWidth={2} className="text-white" />
          </div>
          <h1 className="text-[24px] font-bold mb-1.5 tracking-tight">הבדיקה הסתיימה</h1>
          <p className="text-[13px] opacity-85 leading-relaxed">
            {issueCount === 0
              ? `המשלוח של ${delivery.storeName} תקין במלואו ✨`
              : `מצאנו ${issueCount} פערים במשלוח של ${delivery.storeName}`}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="-mt-10 mx-4 grid grid-cols-3 gap-2 relative z-10">
        <Kpi icon="✅" value={progress.ok} label="תקינים" tone="green" />
        <Kpi icon="❌" value={missing.length} label="חסרים" tone="coral" />
        <Kpi icon="⚠️" value={partial.length + damaged.length} label="חלקי/פגום" tone="yellow" />
      </div>

      {issueCount > 0 && (
        <>
          {/* REFUND CARD */}
          <div className="mx-4 mt-4 p-5 bg-gradient-to-bl from-coral/10 to-coral/[0.02] border-[1.5px] border-coral/25 rounded-[22px] overflow-hidden">
            <div className="text-[11px] text-coral font-bold uppercase tracking-wider mb-1">
              סך החזר מבוקש
            </div>
            <div className="font-display text-[38px] font-bold text-coral leading-none mb-1.5 -tracking-wide">
              {formatILS(refund)}
              <span className="text-[18px] opacity-70 mr-1">/ {formatILS(delivery.ilsTotal)}</span>
            </div>
            <div className="text-[12px] text-text-sub leading-relaxed">
              {refundPct}% מסך ההזמנה
              <br />
              <strong className="text-coral">חסכון של {Math.round(refund)}₪ אם תשלח את הדוח עכשיו</strong>
            </div>
          </div>

          {/* DISCREPANCY GROUPS */}
          <div className="px-4 mt-4">
            <div className="text-[15px] font-bold text-navy py-2">פירוט הפערים</div>

            {missing.length > 0 && (
              <DiscrepancyGroup
                icon="❌"
                tone="coral"
                title="פריטים חסרים לחלוטין"
                subtitle={`${missing.length} פריטים`}
                amount={missing.reduce((s, i) => s + i.totalPrice, 0)}
                items={missing.map((i) => ({
                  name: i.name,
                  qty: `${i.orderedQty} יח׳`,
                  price: i.totalPrice,
                }))}
              />
            )}
            {partial.length > 0 && (
              <DiscrepancyGroup
                icon="⚠️"
                tone="orange"
                title="חלקי / חוסר בכמות"
                subtitle={`${partial.length} פריט${partial.length > 1 ? "ים" : ""}`}
                amount={partial.reduce((s, i) => s + i.unitPrice * (i.orderedQty - (i.receivedQty ?? 0)), 0)}
                items={partial.map((i) => ({
                  name: i.name,
                  qty: `${i.receivedQty ?? 0} מתוך ${i.orderedQty} יח׳`,
                  price: i.unitPrice * (i.orderedQty - (i.receivedQty ?? 0)),
                }))}
              />
            )}
            {damaged.length > 0 && (
              <DiscrepancyGroup
                icon="💔"
                tone="yellow"
                title="פגום / פג תוקף"
                subtitle={`${damaged.length} פריט${damaged.length > 1 ? "ים" : ""}`}
                amount={damaged.reduce((s, i) => s + i.totalPrice, 0)}
                items={damaged.map((i) => ({
                  name: i.name + (i.photoUrl ? " 📸" : ""),
                  qty: i.issueNote ?? "פגום",
                  price: i.totalPrice,
                }))}
              />
            )}
          </div>
        </>
      )}

      {/* QUICK ACTIONS */}
      <div className="px-4 pt-3">
        <div className="text-[15px] font-bold text-navy py-2">פעולות נוספות</div>
        <div className="grid grid-cols-2 gap-2">
          <QuickCard icon={<FileSpreadsheet size={20} className="text-green" />} title="ייצא Excel" subtitle="קובץ מוכן להעלאה" />
          <QuickCard icon={<Save size={20} className="text-navy" />} title="שמור ולא לשלוח" subtitle="המשלוח נשמר בהיסטוריה" />
        </div>
      </div>

      {/* ACTION BAR */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface px-4 pt-3 border-t border-border z-10"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        {issueCount > 0 ? (
          <Button variant="danger" size="lg" onClick={() => router.push(`/delivery/${delivery.id}/email`)} className="w-full">
            <Mail size={20} strokeWidth={2.5} />
            הכן מייל לשירות לקוחות
          </Button>
        ) : (
          <Button variant="success" size="lg" onClick={() => router.push("/")} className="w-full">
            <CheckCircle2 size={20} strokeWidth={2.5} />
            סיים — חזור לבית
          </Button>
        )}
      </div>
    </div>
  );
}

function Kpi({ icon, value, label, tone }: { icon: string; value: number; label: string; tone: "green" | "coral" | "yellow" }) {
  const tones = { green: "border-green text-green", coral: "border-coral text-coral", yellow: "border-yellow text-[#b45309]" };
  return (
    <div className={`bg-surface rounded-[16px] p-3.5 text-center border-t-[3px] shadow-md ${tones[tone]}`}>
      <div className="text-[18px] mb-1">{icon}</div>
      <div className="font-display text-[22px] font-bold leading-none mb-0.5">{value}</div>
      <div className="text-[10px] text-text-sub font-semibold">{label}</div>
    </div>
  );
}

function DiscrepancyGroup({
  icon,
  tone,
  title,
  subtitle,
  amount,
  items,
}: {
  icon: string;
  tone: "coral" | "orange" | "yellow";
  title: string;
  subtitle: string;
  amount: number;
  items: Array<{ name: string; qty: string; price: number }>;
}) {
  const colorClass = tone === "coral" ? "bg-coral/10 text-coral" : tone === "orange" ? "bg-orange/10 text-orange" : "bg-yellow/15 text-[#b45309]";
  const amountClass = tone === "coral" ? "text-coral" : tone === "orange" ? "text-orange" : "text-[#b45309]";

  return (
    <div className="bg-surface border border-border rounded-[16px] mb-3 overflow-hidden">
      <div className="p-3.5 flex items-center gap-2.5 border-b border-border">
        <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center text-base flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold text-navy">{title}</div>
          <div className="text-[11px] text-text-sub">{subtitle}</div>
        </div>
        <div className={`font-display text-[14px] font-bold ${amountClass}`}>
          {formatILS(amount)}
        </div>
      </div>
      <div className="py-1">
        {items.map((it, i) => (
          <div key={i} className="px-3.5 py-2.5 flex items-center text-xs border-b border-border last:border-0">
            <span className="font-medium flex-1">{it.name}</span>
            <span className="text-text-sub text-[11px] ml-2">{it.qty}</span>
            <span className="font-display font-bold ml-2">{formatILS(it.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="bg-surface border border-border rounded-[12px] p-3.5 text-center cursor-pointer hover:border-cyan hover:shadow-sm transition flex flex-col items-center gap-1">
      <div className="mb-1">{icon}</div>
      <div className="text-[12px] font-semibold text-navy">{title}</div>
      <div className="text-[10px] text-text-sub">{subtitle}</div>
    </button>
  );
}
