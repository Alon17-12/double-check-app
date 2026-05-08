import Link from "next/link";
import { ChevronLeft, Lock, Send } from "lucide-react";
import { AppShell, BackButton } from "@/components/shared/AppShell";
import { getUserInbox, listIntakes } from "@/lib/data/inbox";
import { supportedVendors } from "@/lib/mocks/inbox-data";
import { CopyAddressButton } from "./CopyAddressButton";

export default async function InboxSetupPage() {
  const inbox = await getUserInbox();
  const intakes = await listIntakes();
  const successCount = intakes.filter((i) => i.parsedStatus === "success").length;

  return (
    <AppShell>
      <div className="relative bg-gradient-to-br from-navy-dark via-navy to-cyan text-white px-5 pt-6 pb-16 overflow-hidden">
        <div className="absolute -top-12 -left-12 text-[200px] opacity-[0.08] blur-sm pointer-events-none select-none leading-none">📨</div>
        <div className="relative">
          <BackButton href="/" />
          <h1 className="text-[26px] font-bold tracking-tight mt-3 mb-1.5">📨 Inbox Magic</h1>
          <p className="text-[13px] opacity-85 leading-relaxed">
            העבר אישורי הזמנה למייל הזה — והם נכנסים אוטומטית. בלי צילום, בלי OCR.
          </p>
        </div>
      </div>

      <div className="-mt-10 mx-4 bg-surface rounded-[22px] p-5 shadow-[0_4px_14px_rgba(15,23,42,0.08)] relative z-10">
        {inbox ? (
          <>
            <div className="flex items-center gap-2 text-[11px] font-bold text-green mb-3">
              <span className="w-2 h-2 rounded-full bg-green" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
              <span>פעיל • {successCount} הזמנות נקלטו</span>
            </div>

            <div className="bg-gradient-to-bl from-cyan/[0.08] to-navy/[0.04] border-2 border-dashed border-cyan/30 rounded-[16px] p-4 text-center mb-3.5">
              <div className="font-display text-[17px] font-bold text-navy mb-1.5 break-all -tracking-tight">
                {inbox.inboxFull}
              </div>
              <div className="text-[11px] text-text-sub">הכתובת האישית שלך — שלח כל אישור הזמנה לכאן</div>
            </div>

            <CopyAddressButton address={inbox.inboxFull} />
          </>
        ) : (
          <div className="text-center text-text-sub py-4 text-sm">לא נמצאה כתובת — אנא צור קשר עם תמיכה</div>
        )}
      </div>

      <section className="px-4 mt-6">
        <div className="text-[14px] font-bold text-navy mb-3 flex items-center gap-2">
          <span className="text-lg">🚀</span> איך משתמשים?
        </div>

        <Step n={1} title="העברה ידנית" body="קיבלת אישור הזמנה? לחץ Forward → הדבק את הכתובת שלך → שלח. תוך 5 שניות תקבל הודעה שההזמנה נקלטה." />
        <Step n={2} title="פילטר אוטומטי ב-Gmail" body="Settings → Filters → Create filter → From: no-reply@amazon.com → Forward to: הכתובת שלך. עכשיו כל הזמנה מאמזון נכנסת אוטומטית." />
        <Step n={3} title="שיתוף בוואטסאפ לעצמך" body="שמור את הכתובת ב-Saved Messages — תוכל להעתיק במהירות מכל מקום." />
      </section>

      <section className="px-4 mt-5 space-y-2.5">
        <button className="w-full bg-gradient-to-br from-green to-[#16a34a] text-white py-3.5 rounded-[14px] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(34,197,94,0.25)] active:scale-[0.99]">
          <Send size={18} strokeWidth={2.5} />
          שלח מייל בדיקה — לוודא שהכל עובד
        </button>
        <Link
          href="/inbox/intakes"
          className="w-full bg-surface border border-border py-3 rounded-[14px] font-semibold text-sm flex items-center justify-center gap-2 text-navy hover:border-cyan/50 transition"
        >
          📥 צפה ב-{intakes.length} מיילים שנקלטו
          <ChevronLeft size={16} />
        </Link>
      </section>

      <section className="mx-4 mt-5 bg-surface rounded-[16px] border border-border p-4">
        <div className="text-[13px] font-bold text-navy mb-1">ספקים נתמכים מראש 🎯</div>
        <div className="text-[11px] text-text-sub mb-3 leading-relaxed">פרסור ייעודי לדיוק 99%. כל ספק אחר עובד דרך Gemini Generic.</div>
        <div className="grid grid-cols-4 gap-1.5">
          {supportedVendors.map((v, i) => (
            <div
              key={v.id}
              className={`rounded-[10px] py-2.5 px-1 text-center text-[10px] font-semibold ${
                i === supportedVendors.length - 1 ? "bg-gradient-to-br from-cyan to-cyan-dark text-white" : "bg-bg text-text-sub"
              }`}
            >
              <div className="text-lg leading-none mb-0.5">{v.emoji}</div>
              {v.label}
            </div>
          ))}
        </div>
      </section>

      <div className="mx-4 my-5 p-3.5 bg-yellow/10 border border-yellow/30 rounded-[12px] flex gap-2.5 text-[12px] leading-snug">
        <Lock size={18} className="text-[#b45309] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#b45309]">פרטיות:</strong> תוכן המיילים נמחק אחרי 30 יום. רק נתוני ההזמנה נשמרים.
          אפשר לאפס את הכתובת בכל שלב אם הגיע spam.
        </div>
      </div>
    </AppShell>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="bg-surface border border-border rounded-[12px] p-3.5 mb-2 flex gap-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan to-cyan-dark text-white flex items-center justify-center font-display text-[13px] font-bold flex-shrink-0">{n}</div>
      <div className="flex-1 text-[12px] leading-relaxed">
        <div className="font-bold text-navy text-[13px] mb-0.5">{title}</div>
        <div className="text-text-sub">{body}</div>
      </div>
    </div>
  );
}
