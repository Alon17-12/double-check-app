"use client";

import { useMemo, useState } from "react";
import { Copy, Send, FileSpreadsheet, Mail as MailIcon, MessageCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/shared/AppShell";
import { generateEmail, type Tone } from "@/lib/email-template";
import { formatILS, formatDate, cn } from "@/lib/utils";
import type { Delivery } from "@/lib/types";

const STORE_SUPPORT_EMAILS: Record<string, string> = {
  rami_levy: "service@rami-levy.co.il",
  shufersal: "service@shufersal.co.il",
  yochananof: "service@yochananof.co.il",
  amazon_us: "cs-reply@amazon.com",
  iherb: "service@iherb.com",
  aliexpress: "https://www.aliexpress.com/p/ae-customer-service",
};

export function EmailClient({ delivery }: { delivery: Delivery }) {
  const [tone, setTone] = useState<Tone>("formal");
  const [copied, setCopied] = useState(false);

  const email = useMemo(() => generateEmail(delivery, tone), [delivery, tone]);
  const supportEmail = STORE_SUPPORT_EMAILS[delivery.storeId];

  const issueGroups = {
    missing: delivery.items.filter((i) => i.status === "missing"),
    partial: delivery.items.filter((i) => i.status === "partial"),
    damaged: delivery.items.filter((i) => i.status === "damaged"),
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const openMail = () => {
    const to = supportEmail ?? "";
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
  };

  const sendWhatsapp = () => {
    const text = `${email.subject}\n\n${email.body}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-bg pb-[100px] md:my-6 md:rounded-[28px] md:overflow-hidden md:shadow-md md:min-h-[calc(100vh-48px)]">
      <header className="bg-surface px-4 py-3.5 border-b border-border flex items-center gap-3 sticky top-0 z-10">
        <BackButton />
        <div className="flex-1">
          <h1 className="text-base font-bold text-navy">מייל לשירות לקוחות</h1>
          <p className="text-[11px] text-text-sub">מנוסח אוטומטית • ניתן לעריכה</p>
        </div>
      </header>

      <div className="p-4">
        <div className="text-[11px] text-text-sub font-semibold uppercase tracking-wider mb-2 pr-1">סגנון פנייה</div>
        <div className="flex bg-surface rounded-[12px] p-1 gap-0.5 border border-border">
          <ToneBtn current={tone} value="friendly" onSet={setTone} icon="😊" label="חברי" sub="גמיש" />
          <ToneBtn current={tone} value="formal" onSet={setTone} icon="💼" label="עסקי" sub="מקצועי" />
          <ToneBtn current={tone} value="firm" onSet={setTone} icon="⚖️" label="תקיף" sub="משפטי" />
        </div>
      </div>

      <div className="mx-4 mb-3 bg-surface border border-border rounded-[12px] p-3.5">
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-text-sub font-semibold min-w-[36px]">אל:</span>
          <span className="flex-1 font-medium text-navy truncate">{supportEmail ?? "לא זוהה — הקלד ידנית"}</span>
          {supportEmail && <span className="bg-bg text-cyan rounded-md px-2.5 py-1 text-[11px] font-semibold">⚡ זוהה אוטומטית</span>}
        </div>
      </div>

      <div className="mx-4 bg-surface rounded-[16px] border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-3.5 border-b border-border bg-gradient-to-bl from-navy/[0.03] to-cyan/[0.03]">
          <div className="text-sm font-bold text-navy mb-1">{email.subject}</div>
          <div className="text-[11px] text-text-sub">
            משלוח מ-{formatDate(delivery.deliveryDate ?? delivery.orderDate)} •{" "}
            {issueGroups.missing.length + issueGroups.partial.length + issueGroups.damaged.length} פערים • החזר {formatILS(email.refundAmount)}
          </div>
        </div>
        <div className="p-4 text-[13px] leading-[1.85]">
          <p className="mb-2.5">שלום,</p>
          <p className="mb-3">
            קיבלתי היום את הזמנתי (מספר הזמנה: <strong className="text-navy">{delivery.orderNumber}</strong>, תאריך הזמנה: {formatDate(delivery.orderDate)}). לאחר בדיקה מקיפה של המשלוח מול הקבלה, אני מבקש לדווח על הפערים הבאים:
          </p>

          {issueGroups.missing.length > 0 && (
            <Section emoji="❌" title={`פריטים חסרים לחלוטין (${issueGroups.missing.length}):`} color="text-coral">
              {issueGroups.missing.map((i) => (
                <li key={i.id}>
                  <strong>{i.name}</strong> — {i.orderedQty} יח׳ — {formatILS(i.totalPrice)}
                </li>
              ))}
            </Section>
          )}
          {issueGroups.partial.length > 0 && (
            <Section emoji="⚠️" title={`פריטים שהגיעו בכמות חלקית (${issueGroups.partial.length}):`} color="text-[#b45309]">
              {issueGroups.partial.map((i) => (
                <li key={i.id}>
                  <strong>{i.name}</strong> — הוזמנו {i.orderedQty} יח׳, הגיעו {i.receivedQty ?? 0} — חוסר{" "}
                  {formatILS(i.unitPrice * (i.orderedQty - (i.receivedQty ?? 0)))}
                </li>
              ))}
            </Section>
          )}
          {issueGroups.damaged.length > 0 && (
            <Section emoji="💔" title={`פריטים פגומים / פגי תוקף (${issueGroups.damaged.length}):`} color="text-[#b45309]">
              {issueGroups.damaged.map((i) => (
                <li key={i.id}>
                  <strong>{i.name}</strong> — {i.issueNote ?? "פגום"} — {formatILS(i.totalPrice)}
                </li>
              ))}
            </Section>
          )}

          <div className="bg-coral/10 border border-coral/20 rounded-[12px] py-2.5 px-3 my-3 text-center font-bold text-coral text-[14px]">
            סך החזר מבוקש: {formatILS(email.refundAmount)}
          </div>

          <p className="mb-2">אשמח לקבל החזר כספי / זיכוי / משלוח חוזר של הפריטים החסרים. מצורפת הקבלה המלאה לעיון.</p>
          <p>תודה,<br /><strong>אלון גבאי</strong></p>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="text-[11px] text-text-sub font-semibold uppercase tracking-wider mb-2 pr-1">דרכי שיתוף</div>
        <div className="grid grid-cols-2 gap-2">
          <ShareBtn icon={<Copy size={18} className="text-white" />} bg="bg-cyan" name={copied ? "✓ הועתק" : "העתק טקסט"} sub="הכנס לאן שתרצה" onClick={copyEmail} />
          <ShareBtn icon={<MailIcon size={18} className="text-white" />} bg="bg-gradient-to-br from-[#ea4335] to-[#d33b2c]" name="פתח באפליקציית מייל" sub="Gmail / Outlook / iOS" onClick={openMail} />
          <ShareBtn icon={<MessageCircle size={18} className="text-white" />} bg="bg-gradient-to-br from-[#25D366] to-[#128C7E]" name="שלח בוואטסאפ" sub="הודעה ישירה" onClick={sendWhatsapp} />
          <ShareBtn icon={<FileSpreadsheet size={18} className="text-white" />} bg="bg-gradient-to-br from-[#1d6f42] to-[#0c5530]" name="צרף Excel" sub="קובץ מסודר לדוא״ל" />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface px-4 pt-3 border-t border-border z-10 flex gap-2"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <Button variant="secondary" size="lg" aria-label="ערוך מייל"><Pencil size={16} /></Button>
        <Button variant="primary" size="lg" onClick={copyEmail} className="flex-1">
          <Send size={18} strokeWidth={2.5} />
          {copied ? "✓ הועתק לקליפבורד" : "העתק ושלח"}
        </Button>
      </div>
    </div>
  );
}

function ToneBtn({ current, value, onSet, icon, label, sub }: { current: Tone; value: Tone; onSet: (t: Tone) => void; icon: string; label: string; sub: string }) {
  const isActive = current === value;
  return (
    <button onClick={() => onSet(value)} className={cn("flex-1 py-2 px-2 rounded-lg flex flex-col items-center gap-0.5 font-semibold transition-all", isActive ? "bg-navy text-white shadow-[0_4px_12px_rgba(30,58,138,0.2)]" : "bg-transparent text-text-sub")}>
      <span className="text-base">{icon}</span>
      <span className="text-[11px] font-bold">{label}</span>
      <span className={cn("text-[9px] font-medium", isActive ? "opacity-70" : "opacity-60")}>{sub}</span>
    </button>
  );
}

function Section({ emoji, title, color, children }: { emoji: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mt-3.5 mb-2">
      <div className={`text-[12px] font-bold flex items-center gap-1.5 mb-1 ${color}`}>
        <span>{emoji}</span> {title}
      </div>
      <ul className="list-none pl-0 mb-2">{children}</ul>
    </div>
  );
}

function ShareBtn({ icon, bg, name, sub, onClick }: { icon: React.ReactNode; bg: string; name: string; sub: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-surface border border-border rounded-[12px] p-3.5 cursor-pointer flex flex-col items-center gap-1 hover:border-cyan hover:-translate-y-0.5 hover:shadow-sm transition-all">
      <div className={cn("w-9 h-9 rounded-[10px] flex items-center justify-center mb-0.5", bg)}>{icon}</div>
      <div className="text-[12px] font-bold text-navy text-center">{name}</div>
      <div className="text-[10px] text-text-sub">{sub}</div>
    </button>
  );
}
