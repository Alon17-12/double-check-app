import { notFound } from "next/navigation";
import { getDelivery } from "@/lib/data/deliveries";
import { ReviewClient } from "./ReviewClient";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const delivery = await getDelivery(id);
  if (!delivery) notFound();
  return <ReviewClient delivery={delivery} />;
}
