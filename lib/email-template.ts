import type { Delivery } from "@/lib/types";
import { formatILS, formatDate } from "@/lib/utils";

export type Tone = "friendly" | "formal" | "firm";

interface EmailOutput {
  subject: string;
  body: string;
  refundAmount: number;
}

export function generateEmail(delivery: Delivery, tone: Tone = "formal"): EmailOutput {
  const missing = delivery.items.filter((i) => i.status === "missing");
  const partial = delivery.items.filter((i) => i.status === "partial");
  const damaged = delivery.items.filter((i) => i.status === "damaged");
  const wrong = delivery.items.filter((i) => i.status === "wrong_item");

  const refund =
    missing.reduce((s, i) => s + i.totalPrice, 0) +
    partial.reduce((s, i) => s + i.unitPrice * (i.orderedQty - (i.receivedQty ?? 0)), 0) +
    damaged.reduce((s, i) => s + i.totalPrice, 0) +
    wrong.reduce((s, i) => s + i.totalPrice, 0);

  const subject = `פערים בהזמנה #${delivery.orderNumber} מתאריך ${formatDate(delivery.orderDate)}`;

  const opening = openingFor(tone, delivery);
  const sections: string[] = [];

  if (missing.length > 0) {
    const lines = missing.map(
      (i) => `• ${i.name} — ${i.orderedQty} יח׳ — ${formatILS(i.totalPrice)}`,
    );
    sections.push(`פריטים חסרים לחלוטין (${missing.length}):\n${lines.join("\n")}`);
  }
  if (partial.length > 0) {
    const lines = partial.map((i) => {
      const missingQty = i.orderedQty - (i.receivedQty ?? 0);
      return `• ${i.name} — הוזמנו ${i.orderedQty} יח׳, הגיעו ${i.receivedQty ?? 0} — חוסר ${formatILS(i.unitPrice * missingQty)}`;
    });
    sections.push(`פריטים שהגיעו בכמות חלקית (${partial.length}):\n${lines.join("\n")}`);
  }
  if (damaged.length > 0) {
    const lines = damaged.map(
      (i) => `• ${i.name} — ${i.issueNote ?? "פגום"} — ${formatILS(i.totalPrice)}`,
    );
    sections.push(`פריטים פגומים / פגי תוקף (${damaged.length}):\n${lines.join("\n")}`);
  }

  const closing = closingFor(tone, refund);
  const body = `${opening}\n\n${sections.join("\n\n")}\n\nסך החזר מבוקש: ${formatILS(refund)}\n\n${closing}\n\nתודה,\nאלון גבאי`;

  return { subject, body, refundAmount: refund };
}

function openingFor(tone: Tone, d: Delivery): string {
  const dateStr = formatDate(d.orderDate);
  if (tone === "friendly") {
    return `שלום,\n\nרק רציתי לעדכן בקלות שיש לי כמה פערים בהזמנה האחרונה (מספר ${d.orderNumber}, מתאריך ${dateStr}). אשמח אם תוכלו להסתכל ולעזור לי לסגור את העניין:`;
  }
  if (tone === "firm") {
    return `שלום,\n\nאני פונה אליכם בנוגע להזמנה ${d.orderNumber} מתאריך ${dateStr}. בהתאם לחוק הגנת הצרכן, אני זכאי להחזר מלא על פריטים שלא הגיעו או הגיעו פגומים. להלן הפערים שזיהיתי:`;
  }
  return `שלום,\n\nקיבלתי היום את הזמנתי (מספר הזמנה: ${d.orderNumber}, תאריך הזמנה: ${dateStr}). לאחר בדיקה מקיפה של המשלוח מול הקבלה, אני מבקש לדווח על הפערים הבאים:`;
}

function closingFor(tone: Tone, refund: number): string {
  if (tone === "friendly") {
    return `אשמח לקבל החזר/זיכוי או משלוח חוזר של הפריטים החסרים. תודה רבה מראש על הטיפול המהיר 🙏`;
  }
  if (tone === "firm") {
    return `אני מבקש החזר כספי בסך ${formatILS(refund)} בתוך 14 ימי עסקים בהתאם לחוק. במידה ולא יתקבל מענה במסגרת זו, אהיה צפוי לפנות לרשות הצרכנות הישראלית.`;
  }
  return `אשמח לקבל החזר כספי / זיכוי / משלוח חוזר של הפריטים החסרים. מצורפת הקבלה המלאה לעיון. אני זמין לכל שאלה או הבהרה.`;
}
