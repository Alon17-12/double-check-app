import Link from "next/link";
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
  LogOut,
} from "lucide-react";
import { AppShell, BackButton } from "@/components/shared/AppShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserInbox, listIntakes } from "@/lib/data/inbox";
import { listDeliveries } from "@/lib/data/deliveries";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";
import type { Delivery } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const inbox = await getUserInbox();
  const intakes = await listIntakes();
  const deliveries = await listDeliveries();

  const successCount = intakes.filter((i) => i.parsedStatus === "success").length;
  const refunds = Math.round(deliveries.reduce((s, d: Delivery) => s + (d.refundAmount ?? 0), 0));
  const fullName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "";
  const initial = fullName?.[0]?.toUpperCase() ?? "?";

  return (
    <AppShell>
      <header className="bg-surface px-4 py-3.5 border-b border-border flex items-center gap-3">
        <BackButton href="/" />
        <div className="text-[18px] font-bold text-navy">הגדרות</div>
      </header>

      <div className="m-4 bg-gradient-to-br from-navy to-navy-light text-white rounded-[22px] p-5 relative overflow-hidden">
        <div className="absolute -top-14 -left-10 w-40 h-40 rounded-full bg-white/[0.08]" />
        <div className="relative flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan to-cyan-dark flex items-center justify-center font-display text-[22px] font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[17px] font-bold mb-0.5">{fullName}</div>
            <div className="text-[12px] opacity-85 truncate">{user?.email}</div>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-1.5 mt-3.5">
          <ProfileStat value={String(deliveries.length)} label="משלוחים" />
          <ProfileStat value={`₪${refunds}`} label="חסכת" />
          <ProfileStat value={successCount > 0 ? "5⭐" : "—"} label="לקוח טוב" />
        </div>
      </div>

      {inbox && (
        <Link
          href="/inbox"
          className="mx-4 mb-4 flex items-center gap-3 p-3.5 bg-gradient-to-bl from-cyan/[0.12] to-navy/[0.06] border-[1.5px] border-cyan/30 rounded-[16px]"
        >
          <div className="w-11 h-11 bg-cyan rounded-[12px] flex items-center justify-center text-[22px] flex-shrink-0">📨</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-navy mb-0.5">Inbox Magic פעיל</div>
            <div className="text-[11px] text-text-sub leading-snug truncate">
              {inbox.inboxFull}
              <br />
              {successCount} הזמנות נקלטו אוטומטית
            </div>
          </div>
          <ChevronLeft size={18} className="text-cyan flex-shrink-0" />
        </Link>
      )}

      <Section label="חשבון">
        <Row icon={<User size={18} />} iconClass="bg-navy" name="פרופיל אישי" desc={user?.email ?? ""} />
        <Row icon={<PenSquare size={18} />} iconClass="bg-cyan" name="חתימת מייל" desc="מופיעה בסוף כל מייל לשירות לקוחות" />
        <Row icon={<BookMarked size={18} />} iconClass="bg-gradient-to-br from-purple-500 to-purple-700" name="מיילים שמורים לחנויות" desc="ניהול ספקים מועדפים" />
      </Section>

      {inbox && (
        <Section label="📨 Inbox Magic">
          <Row href="/inbox" icon={<Mail size={18} />} iconClass="bg-cyan" name="כתובת ה-Inbox שלך" desc={inbox.inboxFull} />
          <Row href="/inbox/intakes" icon={<Check size={18} />} iconClass="bg-green" name="מיילים שנקלטו" desc={`${intakes.length} מיילים נקלטו`} />
          <Row icon={<Activity size={18} />} iconClass="bg-orange" name="איפוס כתובת" desc="צור כתובת חדשה אם הקיימת מקבלת spam" />
        </Section>
      )}

      <Section label="התראות">
        <Row icon={<Bell size={18} />} iconClass="bg-yellow" name="הזמנה חדשה זוהתה" desc="Push notifications" trailing="פעיל" />
        <Row icon={<AlertCircle size={18} />} iconClass="bg-coral" name="תזכורת לבדיקת משלוח" desc="כשהמשלוח אמור להגיע" trailing="פעיל" />
        <Row icon={<Activity size={18} />} iconClass="bg-text-sub" name="סיכום שבועי" desc="דוח חודשי בכל ראשון" trailing="כבוי" />
      </Section>

      <Section label="נתונים">
        <Row icon={<Download size={18} />} iconClass="bg-green" name="ייצוא כל הנתונים" desc="Excel + JSON" />
        <Row icon={<Clock size={18} />} iconClass="bg-navy" name="מחיקת קבלות אחרי" trailing="30 יום" />
      </Section>

      <Section label="חשבון">
        <form action={signOut}>
          <button type="submit" className="w-full bg-surface px-4 py-3.5 flex items-center gap-3 text-right hover:bg-bg transition">
            <div className="w-9 h-9 rounded-[10px] bg-text-sub flex items-center justify-center text-white">
              <LogOut size={18} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-text-main">התנתקות</div>
              <div className="text-[11px] text-text-sub">צא מהחשבון</div>
            </div>
          </button>
        </form>
      </Section>

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

      <div className="text-center px-4 py-6 text-[11px] text-text-muted">
        <div className="font-display text-[14px] font-bold text-navy mb-1">
          Double<span className="text-cyan">Check</span>
        </div>
        גרסה 0.3.0 • Phase 1+2+Auth
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

function Row({
  icon,
  iconClass,
  name,
  desc,
  trailing,
  href,
}: {
  icon: React.ReactNode;
  iconClass: string;
  name: string;
  desc?: string;
  trailing?: string;
  href?: string;
}) {
  const baseClass = "flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-bg transition";
  const inner = (
    <>
      <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center text-white flex-shrink-0", iconClass)}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold text-text-main truncate">{name}</div>
        {desc && <div className="text-[11px] text-text-sub truncate">{desc}</div>}
      </div>
      {trailing && <span className="text-[12px] text-text-sub font-medium ml-1">{trailing}</span>}
      <ChevronLeft size={18} className="text-text-muted flex-shrink-0" />
    </>
  );
  return href ? <Link href={href} className={baseClass}>{inner}</Link> : <div className={baseClass}>{inner}</div>;
}
