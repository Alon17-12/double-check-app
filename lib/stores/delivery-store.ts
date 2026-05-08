"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Delivery, DeliveryItem, ItemStatus } from "@/lib/types";
import { mockCurrentDelivery, mockHistory } from "@/lib/mocks/data";

// ─────────────────────────────────────────────
// Pure helpers — call from useMemo in components
// ─────────────────────────────────────────────

export interface ProgressSummary {
  total: number;
  ok: number;
  partial: number;
  missing: number;
  damaged: number;
  pending: number;
  percent: number;
}

const EMPTY_PROGRESS: ProgressSummary = {
  total: 0,
  ok: 0,
  partial: 0,
  missing: 0,
  damaged: 0,
  pending: 0,
  percent: 0,
};

export function computeProgress(delivery: Delivery | null): ProgressSummary {
  if (!delivery) return EMPTY_PROGRESS;
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

interface DeliveryStore {
  deliveries: Delivery[];
  currentId: string | null;

  setCurrent: (id: string) => void;
  getCurrent: () => Delivery | null;
  getById: (id: string) => Delivery | null;

  setItemStatus: (
    deliveryId: string,
    itemId: string,
    status: ItemStatus,
    receivedQty?: number,
    issueNote?: string,
  ) => void;

  setItem: (deliveryId: string, itemId: string, patch: Partial<DeliveryItem>) => void;

  addItem: (deliveryId: string, item: Omit<DeliveryItem, "id" | "position">) => void;
  removeItem: (deliveryId: string, itemId: string) => void;

  resetMockData: () => void;
}

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set, get) => ({
      deliveries: mockHistory,
      currentId: mockCurrentDelivery.id,

      setCurrent: (id) => set({ currentId: id }),

      getCurrent: () => {
        const { deliveries, currentId } = get();
        return deliveries.find((d) => d.id === currentId) ?? null;
      },

      getById: (id) => get().deliveries.find((d) => d.id === id) ?? null,

      setItemStatus: (deliveryId, itemId, status, receivedQty, issueNote) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === deliveryId
              ? {
                  ...d,
                  items: d.items.map((it) =>
                    it.id === itemId
                      ? {
                          ...it,
                          status,
                          receivedQty:
                            receivedQty !== undefined
                              ? receivedQty
                              : status === "ok"
                                ? it.orderedQty
                                : status === "missing"
                                  ? 0
                                  : it.receivedQty,
                          issueNote: issueNote ?? it.issueNote,
                        }
                      : it,
                  ),
                }
              : d,
          ),
        })),

      setItem: (deliveryId, itemId, patch) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === deliveryId
              ? {
                  ...d,
                  items: d.items.map((it) =>
                    it.id === itemId ? { ...it, ...patch } : it,
                  ),
                }
              : d,
          ),
        })),

      addItem: (deliveryId, item) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === deliveryId
              ? {
                  ...d,
                  items: [
                    ...d.items,
                    {
                      ...item,
                      id: `i-${Date.now()}`,
                      position: d.items.length + 1,
                    },
                  ],
                }
              : d,
          ),
        })),

      removeItem: (deliveryId, itemId) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === deliveryId
              ? { ...d, items: d.items.filter((it) => it.id !== itemId) }
              : d,
          ),
        })),

      resetMockData: () =>
        set({
          deliveries: mockHistory,
          currentId: mockCurrentDelivery.id,
        }),
    }),
    {
      name: "double-check-storage",
      version: 1,
    },
  ),
);
