"use client";

import Link from "next/link";
import { Bell, Camera, ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/shared/AppShell";
import { Card, StatusBadge } from "@/components/ui/Card";
import { useDeliveryStore } from "@/lib/stores/delivery-store";
import { mockStats, storeLogos } from "@/lib/mocks/data";
import { formatRelativeDate, formatILS } from "@/lib/utils";
import type { Delivery } from "@/lib/types";

export default function HomePage() {
  const deliveries = useDeliveryStore((s) => s.deliveries);
  const recent = deliveries.slice(0, 4);

  return (
    <AppShell>
      {/* HERO HEADER */}
      <header className="relative bg-gradient-to-br from-navy to-navy-light text-white px-5 pt-5 pb-20 overflow-hidden">
        <div className="absolute -top-20 -left-16 w-[200px] h-[200px] rounded-full bg-white/[0.05]" />
        <div className="absolute -bottom-12 -right-10 w-[140px] h-[140px] rounded-full bg-white/[0.05]" />

        <div className="relative flex justify-between items-center mb-5">
          <div className="font-display text-xl font-bold tracking-tight">
            Double<span className="text-cyan">Check</span>
          </div>
          <button
            aria-label="התראות"
            className="w-10 h-10 rounded-full bg-white/[0.12] hover:bg-white/[0.18] transition-colors flex items-center justify-center"
          >
            <Bell size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="relative">
          <h1 className="text-[22px] font-bold mb-1">שלום אלון 👋</h1>
          <p className="text-[13px] opacity-85">
            יש לך משלוח אחד שמחכה לבדיקה
          </p>
        </div>
      </header>

      <div className="relative z-10 -mt-14 px-4">
        {/* CTA CARD */}
        <Card className="rounded-[22px] p-5 text-center shadow-[0_12px_32px_rgba(15,23,42,0.12)] mb-6">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-cyan to-cyan-dark mx-auto mb-3 flex items-center justify-center shadow-[0_8px_20px_rgba(56,196,242,0.35)]">
            <Camera size={32} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-[18px] font-bold mb-1.5 text-navy">וודא משלוח חדש</h2>
          <p className="text-[13px] text-text-sub mb-4 leading-relaxed">
            צלם את הקבלה או העבר אישור הזמנה במייל — הכל נכנס אוטומטית
          </p>

          <Link
            href="/delivery/new"
            className="w-full bg-gradient-to-br from-navy to-navy-light text-white py-[15px] rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(30,58,138,0.25)] hover:brightness-110 transition active:scale-[0.99]"
          >
            <Camera size={20} strokeWidth={2} />
            צלם קבלה
          </Link>

          <button className="mt-2 w-full bg-transparent text-navy border-[1.5px] border-dashed border-[rgba(30,58,138,0.25)] py-3 rounded-[14px] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[rgba(30,58,138,0.04)] transition-colors">
            📨 קליטה דרך מייל
          </button>
        </Card>

        {/* INBOX MAGIC BANNER */}
        <Link
          href="/inbox"
          className="flex items-center gap-3 p-3 mb-5 bg-gradient-to-bl from-cyan/10 to-navy/[0.05] border border-cyan/20 rounded-[16px] hover:border-cyan/40 transition-colors"
        >
          <div className="text-2xl">📨</div>
          <div className="flex-1 text-[12px] leading-[1.5]">
            <strong className="text-navy">Inbox Magic מוכן!</strong>
            <br />
            <span className="text-text-sub">
              העבר אישור מאמזון/AliExpress לכתובת שלך — נקלט אוטומטית
            </span>
          </div>
          <ChevronLeft size={20} className="text-cyan flex-shrink-0" />
        </Link>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatCard value={String(mockStats.completed)} label="משלוחים תקינים" tone="green" />
          <StatCard value={String(mockStats.withIssues)} label="עם פערים" tone="coral" />
          <StatCard value={`₪${mockStats.totalRefunds}`} label="סך החזרים" tone="navy" />
        </div>

        {/* RECENT DELIVERIES */}
        <div className="flex justify-between items-center pb-3 px-1">
          <div className="text-[15px] font-bold text-navy">משלוחים אחרונים</div>
          <Link
            href="/history"
            className="text-[12px] text-cyan font-semibold hover:underline"
          >
            הצג הכל ←
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {recent.map((d) => (
            <DeliveryRow key={d.id} delivery={d} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "green" | "coral" | "navy";
}) {
  const tones = {
    green: "text-green",
    coral: "text-coral",
    navy: "text-navy",
  };
  return (
    <Card className="rounded-[16px] p-3 text-center">
      <div className={`font-display text-[22px] font-bold mb-0.5 ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-text-sub font-medium">{label}</div>
    </Card>
  );
}

function DeliveryRow({ delivery }: { delivery: Delivery }) {
  const logo = storeLogos[delivery.storeId] ?? {
    initials: delivery.storeName.slice(0, 2).toUpperCase(),
    gradient: "from-slate-500 to-slate-700",
  };
  const status = getDisplayStatus(delivery);

  return (
    <Link
      href={`/delivery/${delivery.id}`}
      className="bg-surface border border-border rounded-[16px] p-3.5 flex items-center gap-3 hover:-translate-y-px hover:shadow-md transition cursor-pointer"
    >
      <div
        className={`w-11 h-11 rounded-[12px] bg-gradient-to-br ${logo.gradient} flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0`}
      >
        {logo.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold mb-0.5 truncate">
          {delivery.storeName} — הזמנה #{delivery.orderNumber.slice(-6)}
        </div>
        <div className="text-[11px] text-text-sub">
          {formatRelativeDate(delivery.orderDate)} • {delivery.items.length} פריטים •{" "}
          {delivery.currency === "ILS" ? formatILS(delivery.ilsTotal) : `$${delivery.originalTotal}`}
        </div>
      </div>
      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
    </Link>
  );
}

function getDisplayStatus(d: Delivery): {
  label: string;
  tone: "completed" | "issue" | "refunded" | "pending" | "info";
} {
  if (d.status === "refunded") return { label: "החזר התקבל", tone: "refunded" };
  if (d.status === "completed") return { label: "תקין", tone: "completed" };
  if (d.status === "tracking") {
    const issues = d.items.filter(
      (i) => i.status === "missing" || i.status === "partial" || i.status === "damaged",
    ).length;
    if (issues > 0) return { label: `${issues} פערים`, tone: "issue" };
    return { label: "בבדיקה", tone: "pending" };
  }
  return { label: "בבדיקה", tone: "pending" };
}
