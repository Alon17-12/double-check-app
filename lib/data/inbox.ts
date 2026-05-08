import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface UserInbox {
  inboxLocal: string;
  inboxFull: string;
  isActive: boolean;
  totalEmails: number;
  lastEmailAt: string | null;
}

export type IntakeStatus = "success" | "partial" | "spam" | "failed";

export interface EmailIntake {
  id: string;
  vendorId: string | null;
  vendorLabel: string | null;
  emoji: string | null;
  fromAddress: string | null;
  subject: string | null;
  parsedStatus: IntakeStatus;
  parserUsed: string | null;
  confidence?: number;
  itemCount?: number;
  amount?: string;
  errorMsg?: string;
  receivedAt: string;
  deliveryId?: string | null;
}

export async function getUserInbox(): Promise<UserInbox | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("dc_user_inboxes")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  return {
    inboxLocal: data.inbox_local,
    inboxFull: data.inbox_full ?? `${data.inbox_local}@inbox.doublecheck.app`,
    isActive: data.is_active,
    totalEmails: data.total_emails,
    lastEmailAt: data.last_email_at,
  };
}

export async function listIntakes(): Promise<EmailIntake[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("dc_email_intakes")
    .select("*")
    .order("received_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    vendorId: row.vendor_id,
    vendorLabel: row.vendor_label,
    emoji: row.emoji,
    fromAddress: row.from_address,
    subject: row.subject,
    parsedStatus: row.parsed_status as IntakeStatus,
    parserUsed: row.parser_used,
    confidence: row.confidence != null ? Number(row.confidence) : undefined,
    itemCount: row.item_count ?? undefined,
    amount: row.amount ?? undefined,
    errorMsg: row.error_msg ?? undefined,
    receivedAt: row.received_at,
    deliveryId: row.delivery_id,
  }));
}
