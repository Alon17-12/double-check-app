import { notFound } from "next/navigation";
import { getDelivery } from "@/lib/data/deliveries";
import { EmailClient } from "./EmailClient";

export default async function EmailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const delivery = await getDelivery(id);
  if (!delivery) notFound();
  return <EmailClient delivery={delivery} />;
}
