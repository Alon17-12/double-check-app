// Auto-generated Supabase types — regenerate with: npx supabase gen types
// (or via the Supabase MCP). Do not edit manually.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      dc_deliveries: {
        Row: {
          created_at: string;
          customs_amount: number | null;
          delivery_date: string | null;
          exchange_rate: number | null;
          expected_eta: string | null;
          id: string;
          ils_total: number | null;
          notes: string | null;
          order_date: string | null;
          order_number: string | null;
          original_currency: string;
          original_total: number | null;
          receipt_url: string | null;
          refund_amount: number | null;
          refund_status: string | null;
          source: string;
          status: string;
          store_id: string | null;
          store_name: string | null;
          updated_at: string;
          user_id: string;
          vat_amount: number | null;
        };
        Insert: Partial<Database["public"]["Tables"]["dc_deliveries"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["dc_deliveries"]["Row"]>;
        Relationships: [];
      };
      dc_delivery_items: {
        Row: {
          created_at: string;
          delivery_id: string;
          id: string;
          issue_note: string | null;
          name: string;
          ordered_qty: number;
          photo_url: string | null;
          position: number;
          received_qty: number | null;
          sku: string | null;
          status: string;
          total_price: number;
          unit: string;
          unit_price: number | null;
        };
        Insert: Partial<Database["public"]["Tables"]["dc_delivery_items"]["Row"]> & {
          delivery_id: string;
          name: string;
          position: number;
        };
        Update: Partial<Database["public"]["Tables"]["dc_delivery_items"]["Row"]>;
        Relationships: [];
      };
      dc_user_inboxes: {
        Row: {
          created_at: string;
          inbox_full: string | null;
          inbox_local: string;
          is_active: boolean;
          last_email_at: string | null;
          total_emails: number;
          user_id: string;
        };
        Insert: Partial<Database["public"]["Tables"]["dc_user_inboxes"]["Row"]> & {
          user_id: string;
          inbox_local: string;
        };
        Update: Partial<Database["public"]["Tables"]["dc_user_inboxes"]["Row"]>;
        Relationships: [];
      };
      dc_email_intakes: {
        Row: {
          amount: string | null;
          confidence: number | null;
          delivery_id: string | null;
          emoji: string | null;
          error_msg: string | null;
          from_address: string | null;
          id: string;
          item_count: number | null;
          parsed_status: string;
          parser_used: string | null;
          processed_at: string | null;
          received_at: string;
          subject: string | null;
          user_id: string;
          vendor_id: string | null;
          vendor_label: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["dc_email_intakes"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["dc_email_intakes"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
