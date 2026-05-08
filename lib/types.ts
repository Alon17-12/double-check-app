// ─────────────────────────────────────────────
// Domain types — Double Check
// ─────────────────────────────────────────────

export type ItemStatus =
  | "pending"
  | "ok"
  | "partial"
  | "missing"
  | "damaged"
  | "wrong_item";

export type DeliveryStatus =
  | "draft"
  | "reviewing"
  | "tracking"
  | "completed"
  | "refunded"
  | "rejected";

export type DeliverySource = "photo" | "email" | "extension" | "manual";

export type Currency = "ILS" | "USD" | "EUR" | "GBP";

export interface DeliveryItem {
  id: string;
  position: number;
  name: string;
  unit: "kg" | "unit" | "liter";
  orderedQty: number;
  unitPrice: number;
  totalPrice: number;
  receivedQty: number | null;
  status: ItemStatus;
  issueNote?: string;
  photoUrl?: string;
}

export interface Delivery {
  id: string;
  source: DeliverySource;
  storeName: string;
  storeId: string;
  orderNumber: string;
  orderDate: string; // ISO
  deliveryDate?: string;
  expectedEta?: string;
  currency: Currency;
  exchangeRate?: number;
  originalTotal: number;
  ilsTotal: number;
  vatAmount: number;
  customsAmount?: number;
  receiptUrl?: string;
  status: DeliveryStatus;
  items: DeliveryItem[];
  notes?: string;
  refundAmount?: number;
}
