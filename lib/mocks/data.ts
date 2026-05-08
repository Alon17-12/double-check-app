import type { Delivery, DeliveryItem } from "@/lib/types";

// ─────────────────────────────────────────────
// Mock data — used as fallback when no real data
// ─────────────────────────────────────────────

const ramiLevyItems: DeliveryItem[] = [
  { id: "i1", position: 1, name: "עגבניה", unit: "kg", orderedQty: 1.04, unitPrice: 5.9, totalPrice: 6.11, receivedQty: 1.04, status: "ok" },
  { id: "i2", position: 2, name: "מלפפון", unit: "kg", orderedQty: 0.96, unitPrice: 5.9, totalPrice: 5.68, receivedQty: 0.96, status: "ok" },
  { id: "i3", position: 3, name: "פלפל אדום", unit: "kg", orderedQty: 1.04, unitPrice: 8.9, totalPrice: 9.29, receivedQty: 1.04, status: "ok" },
  { id: "i4", position: 4, name: "בצל יבש", unit: "kg", orderedQty: 0.91, unitPrice: 3.9, totalPrice: 3.56, receivedQty: 0.91, status: "ok" },
  { id: "i5", position: 5, name: "לימון", unit: "kg", orderedQty: 1.02, unitPrice: 8.9, totalPrice: 9.06, receivedQty: 1.02, status: "ok" },
  { id: "i6", position: 6, name: "בצל אדום", unit: "kg", orderedQty: 0.94, unitPrice: 4.9, totalPrice: 4.59, receivedQty: 0.94, status: "ok" },
  { id: "i7", position: 7, name: "אורז בסמטי קלאסי 1 ק״ג סוגת", unit: "unit", orderedQty: 1, unitPrice: 15, totalPrice: 15, receivedQty: 1, status: "ok" },
  { id: "i8", position: 8, name: "סלט מטבוחה אחלה 500 גרם", unit: "unit", orderedQty: 1, unitPrice: 14.9, totalPrice: 14.9, receivedQty: 0, status: "missing" },
  { id: "i9", position: 9, name: "דאו ספריי טיטניום 180 מ\"ל", unit: "unit", orderedQty: 1, unitPrice: 14.9, totalPrice: 14.9, receivedQty: 1, status: "ok" },
  { id: "i10", position: 10, name: "דמי משלוח - אתר אינטרנט", unit: "unit", orderedQty: 1, unitPrice: 35.9, totalPrice: 35.9, receivedQty: 1, status: "ok" },
  { id: "i11", position: 11, name: "מארז פסטרמה 600 ג", unit: "unit", orderedQty: 1, unitPrice: 27.4, totalPrice: 27.4, receivedQty: 1, status: "ok" },
  { id: "i12", position: 12, name: "חומוס עם טחינה צבר 400 גרם", unit: "unit", orderedQty: 1, unitPrice: 13.3, totalPrice: 13.3, receivedQty: 1, status: "ok" },
  { id: "i13", position: 13, name: "מגבונים לניקוי כללי רמי לוי 400 יחידות", unit: "unit", orderedQty: 1, unitPrice: 18.9, totalPrice: 18.9, receivedQty: 1, status: "ok" },
  { id: "i14", position: 14, name: "גבינה צהובה עמק 28% שומן 600 גרם", unit: "unit", orderedQty: 1, unitPrice: 36.6, totalPrice: 36.6, receivedQty: 1, status: "ok" },
  { id: "i15", position: 15, name: "פטריות שמג׳י חוות תקוע 150 גרם", unit: "unit", orderedQty: 1, unitPrice: 7.4, totalPrice: 7.4, receivedQty: 0, status: "missing" },
  { id: "i16", position: 16, name: "ביצים L 18 יחידות", unit: "unit", orderedQty: 1, unitPrice: 21.2, totalPrice: 21.19, receivedQty: 1, status: "ok" },
  { id: "i17", position: 17, name: "שרי קלמרס", unit: "unit", orderedQty: 1, unitPrice: 10, totalPrice: 10, receivedQty: 0, status: "missing" },
  { id: "i18", position: 18, name: "שישיית מי סודה מוגז רמי לוי 250 מ\"ל", unit: "unit", orderedQty: 1, unitPrice: 10.9, totalPrice: 10.9, receivedQty: null, status: "pending" },
  { id: "i19", position: 19, name: "שישיית סודה נענע ליים מוגז רמי לוי 250 מ\"ל", unit: "unit", orderedQty: 1, unitPrice: 10.8, totalPrice: 10.8, receivedQty: null, status: "pending" },
  { id: "i20", position: 20, name: "משקה יטבתה פרו קפה ללא סוכר 350 מ\"ל", unit: "unit", orderedQty: 5, unitPrice: 7.3, totalPrice: 36.5, receivedQty: null, status: "pending" },
  { id: "i21", position: 21, name: "פרניר רוטב עגבניות 100 גר 22BX", unit: "unit", orderedQty: 8, unitPrice: 2.4, totalPrice: 14.88, receivedQty: 5, status: "partial", issueNote: "הוזמנו 8 יח׳, הגיעו 5" },
  { id: "i22", position: 22, name: "עד חצות חלב 200 גרם", unit: "unit", orderedQty: 2, unitPrice: 16.9, totalPrice: 30.01, receivedQty: 2, status: "damaged", issueNote: "פג תוקף" },
  { id: "i23", position: 23, name: "מי סודה בגיזוז חזק טמפו 6 × 1.5 ליטר", unit: "unit", orderedQty: 1, unitPrice: 17.9, totalPrice: 16.9, receivedQty: null, status: "pending" },
];

export const mockCurrentDelivery: Delivery = {
  id: "delivery-001",
  source: "photo",
  storeName: "רמי לוי",
  storeId: "rami_levy",
  orderNumber: "2019794",
  orderDate: "2026-05-07",
  deliveryDate: "2026-05-09",
  currency: "ILS",
  originalTotal: 373.77,
  ilsTotal: 373.77,
  vatAmount: 48.52,
  status: "tracking",
  items: ramiLevyItems,
  refundAmount: 54.5,
};

export const mockHistory: Delivery[] = [
  mockCurrentDelivery,
  {
    id: "delivery-002",
    source: "email",
    storeName: "Amazon US",
    storeId: "amazon_us",
    orderNumber: "112-7834561-2935452",
    orderDate: "2026-05-06",
    expectedEta: "2026-05-14",
    currency: "USD",
    exchangeRate: 3.62,
    originalTotal: 87.5,
    ilsTotal: 316.75,
    vatAmount: 53.85,
    customsAmount: 0,
    status: "tracking",
    items: [],
  },
  {
    id: "delivery-003",
    source: "photo",
    storeName: "שופרסל אונליין",
    storeId: "shufersal",
    orderNumber: "88142",
    orderDate: "2026-05-05",
    deliveryDate: "2026-05-05",
    currency: "ILS",
    originalTotal: 412.3,
    ilsTotal: 412.3,
    vatAmount: 53.6,
    status: "completed",
    items: [],
  },
  {
    id: "delivery-004",
    source: "email",
    storeName: "AliExpress",
    storeId: "aliexpress",
    orderNumber: "8016234567",
    orderDate: "2026-05-03",
    deliveryDate: "2026-05-03",
    currency: "USD",
    exchangeRate: 3.61,
    originalTotal: 24.99,
    ilsTotal: 90.21,
    vatAmount: 0,
    status: "refunded",
    items: [],
    refundAmount: 12,
  },
];

export const mockStats = {
  total: 23,
  completed: 18,
  withIssues: 5,
  totalRefunds: 247,
};

export const storeLogos: Record<string, { initials: string; gradient: string }> = {
  rami_levy: { initials: "RL", gradient: "from-red-500 to-red-700" },
  amazon_us: { initials: "AZ", gradient: "from-orange-400 to-orange-600" },
  shufersal: { initials: "SH", gradient: "from-green-500 to-green-700" },
  aliexpress: { initials: "AE", gradient: "from-red-500 to-red-800" },
  yochananof: { initials: "YO", gradient: "from-indigo-500 to-indigo-700" },
  iherb: { initials: "iH", gradient: "from-green-600 to-green-900" },
  shein: { initials: "SE", gradient: "from-slate-800 to-black" },
  wolt: { initials: "WL", gradient: "from-cyan-500 to-cyan-700" },
};
