import { notFound } from "next/navigation";
import { getDelivery } from "@/lib/data/deliveries";
import { TrackingClient } from "./TrackingClient";

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const delivery = await getDelivery(id);
  if (!delivery) notFound();
  return <TrackingClient delivery={delivery} />;
}
