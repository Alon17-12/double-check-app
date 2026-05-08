// Pure compute helpers — used in components via useMemo.
// Kept separate from any store so it stays React-render-safe.

import type { Delivery } from "@/lib/types";

export interface ProgressSummary {
  total: number;
  ok: number;
  partial: number;
  missing: number;
  damaged: number;
  pending: number;
  percent: number;
}

const EMPTY: ProgressSummary = {
  total: 0,
  ok: 0,
  partial: 0,
  missing: 0,
  damaged: 0,
  pending: 0,
  percent: 0,
};

export function computeProgress(delivery: Delivery | null): ProgressSummary {
  if (!delivery) return EMPTY;
  const counts = { ok: 0, partial: 0, missing: 0, damaged: 0, pending: 0 };
  for (const it of delivery.items) {
    if (it.status === "ok") counts.ok++;
    else if (it.status === "partial") counts.partial++;
    else if (it.status === "missing") counts.missing++;
    else if (it.status === "damaged") counts.damaged++;
    else counts.pending++;
  }
  const total = delivery.items.length;
  const checked = total - counts.pending;
  return {
    total,
    ...counts,
    percent: total > 0 ? Math.round((checked / total) * 100) : 0,
  };
}

export function computeRefund(delivery: Delivery | null): number {
  if (!delivery) return 0;
  let refund = 0;
  for (const it of delivery.items) {
    if (it.status === "missing" || it.status === "damaged") {
      refund += it.totalPrice;
    } else if (it.status === "partial" && it.receivedQty != null) {
      refund += it.unitPrice * (it.orderedQty - it.receivedQty);
    }
  }
  return Math.round(refund * 100) / 100;
}
