"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ItemStatus } from "@/lib/types";

export async function setItemStatus(
  itemId: string,
  status: ItemStatus,
  receivedQty?: number,
  issueNote?: string,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("dc_delivery_items")
    .update({
      status,
      received_qty: receivedQty,
      issue_note: issueNote,
    })
    .eq("id", itemId);

  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function updateItem(
  itemId: string,
  patch: { name?: string; ordered_qty?: number; total_price?: number; unit_price?: number },
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("dc_delivery_items").update(patch).eq("id", itemId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function deleteItem(itemId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("dc_delivery_items").delete().eq("id", itemId);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function deleteDelivery(deliveryId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("dc_deliveries").delete().eq("id", deliveryId);
  if (error) throw error;
  revalidatePath("/", "layout");
}
