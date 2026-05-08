import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Delivery, DeliveryItem, ItemStatus, DeliveryStatus, DeliverySource, Currency } from "@/lib/types";

// ─────────────────────────────────────────────
// Mappers: DB row → domain type
// ─────────────────────────────────────────────

interface DeliveryRow {
  id: string;
  user_id: string;
  source: string;
  store_name: string | null;
  store_id: string | null;
  order_number: string | null;
  order_date: string | null;
  delivery_date: string | null;
  expected_eta: string | null;
  original_currency: string;
  original_total: number | null;
  exchange_rate: number | null;
  ils_total: number | null;
  vat_amount: number | null;
  customs_amount: number | null;
  receipt_url: string | null;
  status: string;
  refund_amount: number | null;
  notes: string | null;
}

interface ItemRow {
  id: string;
  delivery_id: string;
  position: number;
  sku: string | null;
  name: string;
  unit: string;
  ordered_qty: number;
  unit_price: number | null;
  total_price: number;
  received_qty: number | null;
  status: string;
  issue_note: string | null;
  photo_url: string | null;
}

function mapDelivery(row: DeliveryRow, items: ItemRow[] = []): Delivery {
  return {
    id: row.id,
    source: row.source as DeliverySource,
    storeName: row.store_name ?? "",
    storeId: row.store_id ?? "",
    orderNumber: row.order_number ?? "",
    orderDate: row.order_date ?? "",
    deliveryDate: row.delivery_date ?? undefined,
    expectedEta: row.expected_eta ?? undefined,
    currency: (row.original_currency ?? "ILS") as Currency,
    exchangeRate: row.exchange_rate ?? undefined,
    originalTotal: Number(row.original_total ?? 0),
    ilsTotal: Number(row.ils_total ?? 0),
    vatAmount: Number(row.vat_amount ?? 0),
    customsAmount: Number(row.customs_amount ?? 0),
    receiptUrl: row.receipt_url ?? undefined,
    status: row.status as DeliveryStatus,
    items: items.map(mapItem),
    notes: row.notes ?? undefined,
    refundAmount: row.refund_amount ?? undefined,
  };
}

function mapItem(row: ItemRow): DeliveryItem {
  return {
    id: row.id,
    position: row.position,
    name: row.name,
    unit: row.unit as DeliveryItem["unit"],
    orderedQty: Number(row.ordered_qty),
    unitPrice: Number(row.unit_price ?? 0),
    totalPrice: Number(row.total_price),
    receivedQty: row.received_qty != null ? Number(row.received_qty) : null,
    status: row.status as ItemStatus,
    issueNote: row.issue_note ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  };
}

// ─────────────────────────────────────────────
// Queries (server)
// ─────────────────────────────────────────────

export async function listDeliveries(): Promise<Delivery[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("dc_deliveries")
    .select("*, dc_delivery_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listDeliveries error:", error);
    return [];
  }

  return (data ?? []).map((row) =>
    mapDelivery(
      row as unknown as DeliveryRow,
      ((row as unknown as { dc_delivery_items: ItemRow[] }).dc_delivery_items ?? []).sort(
        (a, b) => a.position - b.position,
      ),
    ),
  );
}

export async function getDelivery(id: string): Promise<Delivery | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("dc_deliveries")
    .select("*, dc_delivery_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getDelivery error:", error);
    return null;
  }

  const items = ((data as unknown as { dc_delivery_items: ItemRow[] }).dc_delivery_items ?? []).sort(
    (a, b) => a.position - b.position,
  );
  return mapDelivery(data as unknown as DeliveryRow, items);
}
