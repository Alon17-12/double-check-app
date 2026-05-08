"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Pencil, Trash2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/shared/AppShell";
import { updateItem, deleteItem } from "@/lib/data/actions";
import { formatILS } from "@/lib/utils";
import type { Delivery, DeliveryItem } from "@/lib/types";

export function ReviewClient({ delivery }: { delivery: Delivery }) {
  const router = useRouter();
  const [items, setItems] = useState(delivery.items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const totalQty = items.reduce((sum, i) => sum + i.orderedQty, 0);
  const totalBeforeVat = delivery.ilsTotal - delivery.vatAmount;

  const handleSave = (item: DeliveryItem, patch: { name: string; orderedQty: number; unitPrice: number; totalPrice: number }) => {
    setItems((curr) => curr.map((it) => (it.id === item.id ? { ...it, ...patch } : it)));
    setEditingId(null);
    startTransition(async () => {
      try {
        await updateItem(item.id, {
          name: patch.name,
          ordered_qty: patch.orderedQty,
          unit_price: patch.unitPrice,
          total_price: patch.totalPrice,
        });
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleDelete = (itemId: string) => {
    setItems((curr) => curr.filter((it) => it.id !== itemId));
    setEditingId(null);
    startTransition(async () => {
      try {
        await deleteItem(itemId);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className="mx-auto max-w-[480px] min-h-screen bg-bg pb-[100px] md:my-6 md:rounded-[28px] md:overflow-hidden md:shadow-md md:min-h-[calc(100vh-48px)]">
      <header className="bg-surface px-4 py-3.5 border-b border-border flex items-center gap-3 sticky top-0 z-10">
        <BackButton />
        <div className="flex-1">
          <h1 className="text-base font-bold text-navy">סקירה ועריכה</h1>
          <p className="text-[11px] text-text-sub">ודא שהפריטים נכונים לפני המשך</p>
        </div>
      </header>

      <div className="mx-4 mt-3 p-3.5 bg-green/10 border border-green/20 rounded-[12px] flex items-center gap-3 text-xs leading-snug">
        <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0">
          <Check size={16} strokeWidth={3} className="text-white" />
        </div>
        <div>
          <strong className="text-[#15803d]">זוהה בהצלחה — דיוק 96%</strong>
          <br />
          <span className="text-text-sub">חולצו {items.length} פריטים מקבלת {delivery.storeName}</span>
        </div>
      </div>

      <div className="mx-4 mt-3 mb-3 bg-surface border border-border rounded-[12px] flex overflow-hidden text-[11px]">
        <SummaryCell value={String(items.length)} label="פריטים" />
        <SummaryCell value={totalQty.toFixed(2)} label="סה״כ כמות" />
        <SummaryCell value={formatILS(delivery.ilsTotal)} label="סך עם מע״מ" />
      </div>

      <div className="px-4">
        <div className="text-[12px] font-semibold text-text-sub uppercase tracking-wider mb-2 pr-1">פריטי הקבלה</div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            return isEditing ? (
              <ItemEditRow
                key={item.id}
                item={item}
                onSave={(patch) => handleSave(item, patch)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(item.id)}
              />
            ) : (
              <ItemRow
                key={item.id}
                position={item.position}
                name={item.name}
                metaLine={metaLine(item)}
                onEdit={() => setEditingId(item.id)}
              />
            );
          })}
        </div>

        <button className="mt-3 w-full py-3 bg-transparent border-[1.5px] border-dashed border-[rgba(30,58,138,0.25)] rounded-[12px] text-navy text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[rgba(30,58,138,0.04)] transition-colors">
          <Plus size={16} strokeWidth={2.5} />
          הוסף פריט שלא זוהה
        </button>

        <div className="mt-3 bg-surface border border-border rounded-[12px] p-3.5">
          <TotalRow label="סה״כ לפני מע״מ" value={formatILS(totalBeforeVat)} />
          <TotalRow label="מע״מ" value={formatILS(delivery.vatAmount)} />
          <TotalRow label="סה״כ כולל מע״מ" value={formatILS(delivery.ilsTotal)} primary />
        </div>
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface px-4 pt-3 border-t border-border flex gap-2 z-10"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <Button variant="secondary" onClick={() => router.push("/delivery/new")} className="flex-shrink-0">
          <Camera size={16} /> צלם שוב
        </Button>
        <Button variant="primary" onClick={() => router.push(`/delivery/${delivery.id}`)} className="flex-1">
          המשך לסימון משלוח
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}

function metaLine(item: DeliveryItem) {
  const unitLabel = item.unit === "kg" ? "ק״ג" : item.unit === "liter" ? "ליטר" : "יח׳";
  if (item.unit === "kg") {
    return `${item.orderedQty.toFixed(2)} ${unitLabel} × ${item.unitPrice} • ${formatILS(item.totalPrice)}`;
  }
  if (item.orderedQty === 1) return `${item.orderedQty} ${unitLabel} • ${formatILS(item.totalPrice)}`;
  return `${item.orderedQty} ${unitLabel} × ${item.unitPrice} • ${formatILS(item.totalPrice)}`;
}

function SummaryCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 px-2 py-2.5 text-center border-l border-border last:border-l-0">
      <div className="font-display text-[16px] font-bold text-navy mb-0.5">{value}</div>
      <div className="text-text-sub">{label}</div>
    </div>
  );
}

function TotalRow({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div
      className={`flex justify-between py-1.5 text-sm ${
        primary ? "text-[15px] font-bold text-navy border-t border-border pt-2.5 mt-1" : ""
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ItemRow({ position, name, metaLine, onEdit }: { position: number; name: string; metaLine: string; onEdit: () => void }) {
  return (
    <div className="bg-surface border border-border rounded-[12px] p-3 flex items-center gap-2.5 hover:border-cyan/40 hover:shadow-sm transition">
      <div className="w-[26px] h-[26px] bg-bg rounded-lg flex items-center justify-center font-display text-[11px] font-bold text-text-sub flex-shrink-0">
        {position}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium mb-0.5 truncate">{name}</div>
        <div className="text-[11px] text-text-sub truncate">{metaLine}</div>
      </div>
      <button onClick={onEdit} aria-label="ערוך" className="w-[30px] h-[30px] rounded-lg bg-bg flex items-center justify-center text-text-sub hover:bg-[rgba(30,58,138,0.08)] hover:text-navy transition">
        <Pencil size={14} />
      </button>
    </div>
  );
}

function ItemEditRow({
  item,
  onSave,
  onCancel,
  onDelete,
}: {
  item: DeliveryItem;
  onSave: (patch: { name: string; orderedQty: number; unitPrice: number; totalPrice: number }) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(String(item.orderedQty));
  const [price, setPrice] = useState(String(item.totalPrice));

  return (
    <div className="bg-surface border-cyan border rounded-[12px] shadow-[0_0_0_3px_rgba(56,196,242,0.15)] p-3 flex items-start gap-2.5">
      <div className="w-[26px] h-[26px] bg-bg rounded-lg flex items-center justify-center font-display text-[11px] font-bold text-text-sub flex-shrink-0 mt-1">
        {item.position}
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="שם הפריט" className="w-full px-2.5 py-1.5 border border-border rounded-md bg-bg text-[13px]" />
        <div className="flex gap-1.5">
          <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" step="0.01" placeholder="כמות" className="flex-1 px-2.5 py-1.5 border border-border rounded-md bg-bg text-[13px]" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" placeholder="מחיר" className="flex-1 px-2.5 py-1.5 border border-border rounded-md bg-bg text-[13px]" />
        </div>
        <div className="flex gap-1.5 mt-1">
          <button
            onClick={() =>
              onSave({
                name,
                orderedQty: parseFloat(qty) || 0,
                totalPrice: parseFloat(price) || 0,
                unitPrice: (parseFloat(price) || 0) / (parseFloat(qty) || 1),
              })
            }
            className="flex-1 bg-cyan text-white py-2 rounded-md text-[12px] font-semibold"
          >
            שמור
          </button>
          <button onClick={onCancel} className="px-3 bg-bg text-text-sub py-2 rounded-md text-[12px] font-semibold">
            ביטול
          </button>
        </div>
      </div>
      <button onClick={onDelete} aria-label="מחק" className="w-[30px] h-[30px] rounded-lg bg-bg flex items-center justify-center text-text-sub hover:bg-coral/10 hover:text-coral transition mt-1">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
