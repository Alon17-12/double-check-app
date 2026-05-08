"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  PenSquare,
  BookMarked,
  Mail,
  Check,
  Bell,
  AlertCircle,
  Activity,
  Download,
  Clock,
  Trash2,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { AppShell, BackButton } from "@/components/shared/AppShell";
import { useDeliveryStore } from "@/lib/stores/delivery-store";
import { mockUserInbox, mockIntakes } from "@/lib/mocks/inbox-data";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const reset = useDeliveryStore((s) => s.resetMockData);
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyReminder, setNotifyReminder] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  const successCount = mockIntakes.filter((i) => i.parsedStatus === "success").length;

  return (
    <AppShell>
      {/* HEADER */}
      <header className="bg-surface px-4 py-3.5 border-b border-border flex items-center gap-3">
        <BackButton href="/" />
        <div className="text-[18px] font-bold text-navy">הגדרות</div>
      </header>

      {/* PROFILE CARD */}
      <div className="m-4 bg-gradient-to-br from-navy to-navy-light text-white rounded-[22px] p-5 relative overflow-hidden">
        <div className="absolute -top-14 -left-10 w-40 h-40 rounded-full bg-white/[0.08]" />
        <div className="relative flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan to-cyan-dark flex items-center justify-center font-display text-[22px] font-bold flex-shrink-0">
            א
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[17px] font-bold mb-0.5">אלון גבאי</div>
            <div className="text-[12px] opacity-85 truncate">alon@alon-gabay.co.il</div>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-1.5 mt-3.5">
          <ProfileStat value="23" label="משלוחים" />
          <ProfileStat value="₪247" label="חסכת השנה" />
          <ProfileStat value="5⭐" label="לקוח טוב" />
        </div>
      </div>

      {/* INBOX MAGIC BANNER */}
      <Link
        href="/inbox"
        className="mx-4 mb-4 flex items-center gap-3 p-3.5 bg-gradient-to-bl from-cyan/[0.12] to-navy/[0.06] border-[1.5px] border-cyan/30 rounded-[16px]"
      >
        <div className="w-11 h-11 bg-cyan rounded-[12px] flex items-center justify-center text-[22px] flex-shrink-0">
          📨
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-navy mb-0.5">Inbox Magic פעיל</div>
          <div className="text-[11px] text-text-sub leading-snug truncate">
            {mockUserInbox.inboxFull}
            <br />
            {successCount} הזמנות נקלטו אוטומטית
          </div>
        </div>
        <ChevronLeft size={18} className="text-cyan flex-shrink-0" />
      </Link>

      {/* ACCOUNT */}
      <Section label="חשבון">
        <Row icon={<User size={18} />} iconClass="bg-navy" name="פרופיל אישי" desc="שם, מייל, מספר טלפון" />
        <Row icon={<PenSquare size={18} />} iconClass="bg-cyan" name="חתימת מייל" desc="מופיעה בסוף כל מייל לשירות לקוחות" />
        <Row icon={<BookMarked size={18} />} iconClass="bg-gradient-to-br from-purple-500 to-purple-700" name="מיילים שמורים לחנויות" desc="14 ספקים שמורים" />
      </Section>

      {/* INBOX MAGIC */}
      <Section label="📨 Inbox Magic">
        <Row href="/inbox" icon={<Mail size={18} />} iconClass="bg-cyan" name="כתובת ה-Inbox שלך" desc={mockUserInbox.inboxFull} />
        <Row href="/inbox/intakes" icon={<Check size={18} />} iconClass="bg-green" name="מיילים שנקלטו" desc={`${mockIntakes.length} מיילים נקלטו`} />
        <Row icon={<Activity size={18} />} iconClass="bg-orange" name="איפוס כתובת" desc="צור כתובת חדשה אם הקיימת מקבלת spam" />
      </Section>

      {/* NOTIFICATIONS */}
      <Section label="התראות">
        <ToggleRow
          icon={<Bell size={18} />}
          iconClass="bg-yellow"
          name="הזמנה חדשה זוהתה"
          desc="Push notifications"
          checked={notifyOrder}
          onChange={setNotifyOrder}
        />
        <ToggleRow
          icon={<AlertCircle size={18} />}
          iconClass="bg-coral"
          name="תזכורת לבדיקת משלוח"
          desc="כשהמשלוח אמור להגיע"
          checked={notifyReminder}
          onChange={setNotifyReminder}
        />
        <ToggleRow
          icon={<Activity size={18} />}
          iconClass="bg-text-sub"
          name="סיכום שבועי"
          desc="דוח חודשי בכל ראשון"
          checked={notifyWeekly}
          onChange={setNotifyWeekly}
        />
      </Section>

      {/* DATA */}
      <Section label="נתונים">
        <Row icon={<Download size={18} />} iconClass="bg-green" name="ייצוא כל הנתונים" desc="Excel + JSON" />
        <Row icon={<Clock size={18} />} iconClass="bg-navy" name="מחיקת קבלות אחרי" desc="" trailing="30 יום" />
        <button
          onClick={() => {
            reset();
            alert("הנתונים אופסו לברירת המחדל");
          }}
          className="w-full bg-surface border-t border-border first:border-t-0 px-4 py-3.5 flex items-center gap-3 text-right hover:bg-bg transition"
        >
          <div className="w-9 h-9 rounded-[10px] bg-cyan flex items-center justify-center text-white">
            <RotateCcw size={18} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-text-main">איפוס נתוני MVP</div>
            <div className="text-[11px] text-text-sub">החזר את ה-mock data לברירת מחדל</div>
          </div>
        </button>
      </Section>

      {/* DANGER */}
      <Section label="פעולות מסוכנות">
        <button className="w-full bg-surface px-4 py-3.5 flex items-center gap-3 text-right hover:bg-bg transition">
          <div className="w-9 h-9 rounded-[10px] bg-coral flex items-center justify-center text-white">
            <Trash2 size={18} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-coral">מחק חשבון ונתונים</div>
          </div>
        </button>
      </Section>

      {/* APP INFO */}
      <div className="text-center px-4 py-6 text-[11px] text-text-muted">
        <div className="font-display text-[14px] font-bold text-navy mb-1">
          Double<span className="text-cyan">Check</span>
        </div>
        גרסה 0.2.0 • Phase 1 + 2
        <br />
        Made with ❤️ in Tel Aviv
      </div>
    </AppShell>
  );
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/[0.12] backdrop-blur rounded-[12px] py-2.5 px-2 text-center">
      <div className="font-display text-[16px] font-bold mb-0.5">{value}</div>
      <div className="text-[10px] opacity-85">{label}</div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mx-4 mt-4">
      <div className="text-[11px] font-bold text-text-sub uppercase tracking-wider pr-1 pb-2">{label}</div>
      <div className="bg-surface border border-border rounded-[16px] overflow-hidden">{children}</div>
    </div>
  );
}

interface RowProps {
  icon: React.ReactNode;
  iconClass: string;
  name: string;
  desc?: string;
  trailing?: string;
  href?: string;
}

function Row({ icon, iconClass, name, desc, trailing, href }: RowProps) {
  const inner = (
    <>
      <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center text-white flex-shrink-0", iconClass)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-text-main truncate">{name}</div>
        {desc && <div className="text-[11px] text-text-sub truncate">{desc}</div>}
      </div>
      {trailing && <span className="text-[12px] text-text-sub font-medium ml-1">{trailing}</span>}
      <ChevronLeft size={18} className="text-text-muted flex-shrink-0" />
    </>
  );

  const baseClass =
    "flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-bg transition";

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }
  return <div className={baseClass}>{inner}</div>;
}

function ToggleRow({
  icon,
  iconClass,
  name,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  iconClass: string;
  name: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-bg transition"
    >
      <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center text-white flex-shrink-0", iconClass)}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold text-text-main">{name}</div>
        <div className="text-[11px] text-text-sub">{desc}</div>
      </div>
      <div
        className={cn(
          "w-11 h-6 rounded-full relative transition-colors flex-shrink-0",
          checked ? "bg-green" : "bg-text-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full transition-all",
            checked ? "right-[calc(100%-21px)]" : "right-[3px]",
          )}
        />
      </div>
    </div>
  );
}
