// ─────────────────────────────────────────────
// Mock data for Inbox Magic
// ─────────────────────────────────────────────

export interface UserInbox {
  inboxLocal: string;
  inboxFull: string;
  isActive: boolean;
  totalEmails: number;
  lastEmailAt: string;
}

export type IntakeStatus = "success" | "partial" | "spam" | "failed";

export interface EmailIntake {
  id: string;
  vendorId: string;
  vendorLabel: string;
  emoji: string;
  fromAddress: string;
  subject: string;
  parsedStatus: IntakeStatus;
  parserUsed: string;
  confidence?: number;
  itemCount?: number;
  amount?: string;
  errorMsg?: string;
  receivedAt: string;
  deliveryId?: string;
}

export const mockUserInbox: UserInbox = {
  inboxLocal: "swift-eagle-42",
  inboxFull: "swift-eagle-42@inbox.doublecheck.app",
  isActive: true,
  totalEmails: 17,
  lastEmailAt: "2026-05-09T14:32:00Z",
};

export const mockIntakes: EmailIntake[] = [
  {
    id: "intake-1",
    vendorId: "amazon_us",
    vendorLabel: "Amazon US",
    emoji: "📦",
    fromAddress: "auto-confirm@amazon.com",
    subject: "Your Amazon.com order #112-7834561",
    parsedStatus: "success",
    parserUsed: "amazon_us",
    confidence: 0.98,
    itemCount: 4,
    amount: "$87.50",
    receivedAt: "2026-05-09T14:32:00Z",
    deliveryId: "delivery-002",
  },
  {
    id: "intake-2",
    vendorId: "aliexpress",
    vendorLabel: "AliExpress",
    emoji: "🛒",
    fromAddress: "transaction@notice.aliexpress.com",
    subject: "Your AliExpress order #8016234567",
    parsedStatus: "success",
    parserUsed: "aliexpress",
    confidence: 0.96,
    itemCount: 2,
    amount: "$24.99",
    receivedAt: "2026-05-09T11:48:00Z",
    deliveryId: "delivery-004",
  },
  {
    id: "intake-3",
    vendorId: "unknown",
    vendorLabel: "חנות לא מזוהה",
    emoji: "⚠️",
    fromAddress: "orders@new-store.co.il",
    subject: "אישור הזמנה",
    parsedStatus: "partial",
    parserUsed: "gemini_generic",
    confidence: 0.76,
    itemCount: 8,
    receivedAt: "2026-05-09T10:15:00Z",
    errorMsg: "דיוק נמוך — נדרשת סקירה ידנית",
  },
  {
    id: "intake-4",
    vendorId: "shufersal",
    vendorLabel: "שופרסל אונליין",
    emoji: "🥚",
    fromAddress: "orders@shufersal.co.il",
    subject: "אישור הזמנה #88142",
    parsedStatus: "success",
    parserUsed: "shufersal",
    confidence: 0.99,
    itemCount: 31,
    amount: "₪412.30",
    receivedAt: "2026-05-08T19:22:00Z",
    deliveryId: "delivery-003",
  },
  {
    id: "intake-5",
    vendorId: "iherb",
    vendorLabel: "iHerb",
    emoji: "💊",
    fromAddress: "orders@iherb.com",
    subject: "iHerb Order Confirmation",
    parsedStatus: "success",
    parserUsed: "iherb",
    confidence: 0.97,
    itemCount: 6,
    amount: "$64.30",
    receivedAt: "2026-05-08T08:14:00Z",
  },
  {
    id: "intake-6",
    vendorId: "spam",
    vendorLabel: "לא הזמנה — נדחה",
    emoji: "🚫",
    fromAddress: "newsletter@somesite.com",
    subject: "מבצעי השבוע! עד 50% הנחה",
    parsedStatus: "spam",
    parserUsed: "gemini_classifier",
    receivedAt: "2026-05-08T06:30:00Z",
    errorMsg: "Gemini classifier: not an order",
  },
  {
    id: "intake-7",
    vendorId: "shein",
    vendorLabel: "SHEIN",
    emoji: "👕",
    fromAddress: "orders@shein.com",
    subject: "Your SHEIN Order is Confirmed",
    parsedStatus: "success",
    parserUsed: "shein",
    confidence: 0.94,
    itemCount: 12,
    amount: "$78.20",
    receivedAt: "2026-05-07T21:45:00Z",
  },
  {
    id: "intake-8",
    vendorId: "wolt",
    vendorLabel: "Wolt Market",
    emoji: "🍱",
    fromAddress: "orders@wolt.com",
    subject: "אישור הזמנה Wolt Market",
    parsedStatus: "success",
    parserUsed: "wolt",
    confidence: 0.98,
    itemCount: 15,
    amount: "₪187.50",
    receivedAt: "2026-05-07T12:33:00Z",
  },
];

export const supportedVendors = [
  { emoji: "📦", label: "Amazon", id: "amazon" },
  { emoji: "🛒", label: "AliExpress", id: "aliexpress" },
  { emoji: "👕", label: "SHEIN", id: "shein" },
  { emoji: "🛍", label: "Temu", id: "temu" },
  { emoji: "💊", label: "iHerb", id: "iherb" },
  { emoji: "🔵", label: "eBay", id: "ebay" },
  { emoji: "🥬", label: "רמי לוי", id: "rami_levy" },
  { emoji: "🥚", label: "שופרסל", id: "shufersal" },
  { emoji: "🍞", label: "יוחננוף", id: "yochananof" },
  { emoji: "🍱", label: "Wolt", id: "wolt" },
  { emoji: "🚀", label: "Yango", id: "yango" },
  { emoji: "✨", label: "+ אחר", id: "other" },
];
