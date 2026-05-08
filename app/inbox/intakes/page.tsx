"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { AppShell, BackButton } from "@/components/shared/AppShell";
import { mockUserInbox, mockIntakes, type EmailIntake, type IntakeStatus } from "@/lib/mocks/inbox-data";
import { cn } from "@/lib/utils";

type Filter = "all" | "success" | "issues" | "spam";

export default function IntakesPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const stats = {
    total: mockIntakes.length,
    success: mockIntakes.filter((i) => i.parsedStatus === "success").length,
    partial: mockIntakes.filter((i) => i.parsedStatus === "partial").length,
    rejected: mockIntakes.filter((i) => i.parsedStatus === "spam" || i.parsedStatus === "failed").length,
  };

  const filtered = mockIntakes.filter((i) => {
    if (filter === "all") return true;
    if (filter === "success") return i.parsedStatus === "success";
    if (filter === "issues") return i.parsedStatus === "partial";
    if (filter === "spam") return i.parsedStatus === "spam" || i.parsedStatus === "failed";
    return true;
  });

  // Group by date
  const groups: Record<string, EmailIntake[]> = {};
  for (const intake of filtered) {
    const dayKey = formatDayKey(intake.receivedAt);
    if (!groups[dayKey]) groups[dayKey] = [];
    groups[dayKey].push(intake);
  }

  return (
    <AppShell>
      {/* HEADER */}
      <header className="bg-surface px-4 py-3.5 border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <BackButton href="/inbox" />
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-navy flex items-center gap-1.5">
              📨 מיילים שנקלטו
            </h1>
            <p className="text-[11px] text-text-sub">היסטוריית פיענוח של Inbox Magic</p>
          </div>
          <Link
            href="/inbox"
            aria-label="הגדרות"
            className="w-9 h-9 rounded-[10px] bg-bg text-navy flex items-center justify-center"
          >
            <SettingsIcon size={20} strokeWidth={2} />
          </Link>
        </div>
        <div className="bg-bg rounded-lg px-3 py-2 flex items-center gap-2 text-[11px] text-text-sub">
          <span>📬</span>
          <code className="font-display text-navy font-semibold flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {mockUserInbox.inboxFull}
          </code>
        </div>
      </header>

      {/* STATS STRIP */}
      <div className="flex bg-surface border-b border-border">
        <StatCell value={stats.total} label="סך מיילים" tone="navy" />
        <StatCell value={stats.success} label="פוענחו" tone="green" />
        <StatCell value={stats.partial} label="חלקיים" tone="orange" />
        <StatCell value={stats.rejected} label="נדחה" tone="coral" />
      </div>

      {/* FILTERS */}
      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto no-scrollbar">
        <Pill active={filter === "all"} onClick={() => setFilter("all")} label="הכל" />
        <Pill active={filter === "success"} onClick={() => setFilter("success")} label="פוענחו" />
        <Pill active={filter === "issues"} onClick={() => setFilter("issues")} label="דורשים בדיקה" />
        <Pill active={filter === "spam"} onClick={() => setFilter("spam")} label="spam/נדחו" />
      </div>

      {/* INTAKES BY DAY */}
      {Object.keys(groups).length === 0 ? (
        <div className="text-center text-text-sub text-sm py-12">אין מיילים בקטגוריה זו</div>
      ) : (
        Object.entries(groups).map(([day, intakes]) => (
          <div key={day}>
            <div className="px-4 pt-3 pb-1.5 text-[11px] font-bold text-text-sub uppercase tracking-wider">
              {day}
            </div>
            <div className="px-3 flex flex-col gap-2">
              {intakes.map((intake) => (
                <IntakeRow key={intake.id} intake={intake} />
              ))}
            </div>
          </div>
        ))
      )}

      <div className="h-6" />
    </AppShell>
  );
}

function StatCell({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "navy" | "green" | "orange" | "coral";
}) {
  const tones = {
    navy: "text-navy",
    green: "text-green",
    orange: "text-orange",
    coral: "text-coral",
  };
  return (
    <div className="flex-1 px-2 py-3 text-center border-l border-border last:border-0 text-[11px] text-text-sub">
      <strong className={cn("block font-display text-[18px] mb-0.5", tones[tone])}>{value}</strong>
      {label}
    </div>
  );
}

function Pill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors",
        active
          ? "bg-navy text-white border border-navy"
          : "bg-surface text-text-sub border border-border",
      )}
    >
      {label}
    </button>
  );
}

function IntakeRow({ intake }: { intake: EmailIntake }) {
  const statusBar = getStatusBar(intake.parsedStatus);
  const statusBg = getStatusBg(intake.parsedStatus);

  const Wrapper: React.ElementType = intake.deliveryId ? Link : "div";
  const wrapperProps = intake.deliveryId
    ? { href: `/delivery/${intake.deliveryId}` as const }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="bg-surface border border-border rounded-[12px] p-3 flex gap-3 relative cursor-pointer hover:border-cyan hover:shadow-sm transition"
    >
      <div className={cn("absolute right-0 top-0 bottom-0 w-1 rounded-r-[12px]", statusBar)} />

      <div className={cn("w-10 h-10 rounded-[11px] flex items-center justify-center text-lg flex-shrink-0", statusBg)}>
        {intake.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[13px] font-bold text-navy flex-1 truncate">
            {intake.vendorLabel}
          </span>
          <span className="text-[10px] text-text-muted font-display flex-shrink-0">
            {formatTime(intake.receivedAt)}
          </span>
        </div>
        <div className="text-[11px] text-text-sub mb-1.5 truncate" dir="ltr" style={{ textAlign: "right" }}>
          {intake.fromAddress}
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <ResultBadge status={intake.parsedStatus} />
          {intake.parserUsed && (
            <span className="text-[9px] bg-cyan/15 text-cyan px-1.5 py-0.5 rounded-full font-semibold font-display">
              {intake.parserUsed}
            </span>
          )}
          <span className="text-text-sub flex-1 truncate">
            {intake.errorMsg ?? (intake.itemCount ? `${intake.itemCount} פריטים` : null)}
          </span>
          {intake.amount && (
            <span className="font-display font-bold text-navy">
              {intake.amount}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

function ResultBadge({ status }: { status: IntakeStatus }) {
  const map: Record<IntakeStatus, { label: string; className: string }> = {
    success: { label: "✓ פוענח", className: "bg-green/15 text-[#15803d]" },
    partial: { label: "⚠ חלקי", className: "bg-orange/15 text-[#c2410c]" },
    spam: { label: "🚫 פרסומת", className: "bg-text-muted/15 text-text-sub" },
    failed: { label: "✗ כשל", className: "bg-coral/15 text-[#be123c]" },
  };
  const cfg = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  );
}

function getStatusBar(status: IntakeStatus) {
  return {
    success: "bg-green",
    partial: "bg-orange",
    spam: "bg-text-muted",
    failed: "bg-coral",
  }[status];
}

function getStatusBg(status: IntakeStatus) {
  return {
    success: "bg-green/12",
    partial: "bg-orange/12",
    spam: "bg-text-muted/12",
    failed: "bg-coral/12",
  }[status];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function formatDayKey(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today.getTime() - target.getTime()) / 86400000);

  if (diffDays === 0) return `היום • ${target.toLocaleDateString("he-IL", { day: "numeric", month: "long" })}`;
  if (diffDays === 1) return `אתמול • ${target.toLocaleDateString("he-IL", { day: "numeric", month: "long" })}`;
  if (diffDays === 2) return `לפני יומיים • ${target.toLocaleDateString("he-IL", { day: "numeric", month: "long" })}`;
  return target.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
}
