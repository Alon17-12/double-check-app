import { AppShell } from "@/components/shared/AppShell";
import { listDeliveries } from "@/lib/data/deliveries";
import { HistoryClient } from "./HistoryClient";

export default async function HistoryPage() {
  const deliveries = await listDeliveries();
  return (
    <AppShell>
      <HistoryClient deliveries={deliveries} />
    </AppShell>
  );
}
