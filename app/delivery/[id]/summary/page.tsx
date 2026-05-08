import { notFound } from "next/navigation";
import { getDelivery } from "@/lib/data/deliveries";
import { computeProgress, computeRefund } from "@/lib/progress";
import { SummaryClient } from "./SummaryClient";

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const delivery = await getDelivery(id);
  if (!delivery) notFound();

  const refund = computeRefund(delivery);
  const progress = computeProgress(delivery);

  return <SummaryClient delivery={delivery} refund={refund} progress={progress} />;
}
