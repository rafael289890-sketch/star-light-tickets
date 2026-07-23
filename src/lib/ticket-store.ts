import { supabase } from "@/lib/supabase";

export type Ticket = {
  id: string;
  event: string;
  category: string;
  city: string;
  date: string;
  subtotal: number;
  fee: number;
  total: number;
  orderId: string;
  status: "pending" | "paid";
  buyerEmail?: string;
  purchasedAt?: string;
};

const KEY = "ticketou_tickets";

export const TICKET_OPTION: Omit<Ticket, "orderId" | "status"> = {
  id: "frontstage-inteira",
  event: "Starlight Festival",
  category: "FRONTSTAGE - INTEIRA",
  city: "Brasília - DF",
  date: "22 de Agosto de 2026",
  subtotal: 250,
  fee: 25,
  total: 275,
};

type TicketRow = {
  id: string;
  event: string;
  category: string;
  city: string;
  date: string;
  subtotal: number;
  fee: number;
  total: number;
  order_id: string;
  status: string;
  buyer_email: string | null;
  purchased_at: string | null;
};

const toTicket = (r: TicketRow): Ticket => ({
  id: r.id,
  event: r.event,
  category: r.category,
  city: r.city,
  date: r.date,
  subtotal: Number(r.subtotal),
  fee: Number(r.fee),
  total: Number(r.total),
  orderId: r.order_id,
  status: r.status as "pending" | "paid",
  buyerEmail: r.buyer_email ?? undefined,
  purchasedAt: r.purchased_at ?? undefined,
});

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id, event, category, city, date, subtotal, fee, total, order_id, status, buyer_email, purchased_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load tickets:", error.message);
    return [];
  }
  return (data as TicketRow[]).map(toTicket);
}

export async function getTicketByOrderId(orderId: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id, event, category, city, date, subtotal, fee, total, order_id, status, buyer_email, purchased_at",
    )
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load ticket:", error.message);
    return null;
  }
  return data ? toTicket(data as TicketRow) : null;
}

export async function saveTicket(t: Ticket): Promise<Ticket | null> {
  const payload = {
    event: t.event,
    category: t.category,
    city: t.city,
    date: t.date,
    subtotal: t.subtotal,
    fee: t.fee,
    total: t.total,
    order_id: t.orderId,
    status: t.status,
    buyer_email: t.buyerEmail ?? null,
    purchased_at: t.purchasedAt ?? null,
  };

  const { data: existing } = await supabase
    .from("tickets")
    .select("id")
    .eq("order_id", t.orderId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("tickets")
      .update(payload)
      .eq("order_id", t.orderId)
      .select(
        "id, event, category, city, date, subtotal, fee, total, order_id, status, buyer_email, purchased_at",
      )
      .maybeSingle();
    if (error) {
      console.error("Failed to update ticket:", error.message);
      return null;
    }
    window.dispatchEvent(new Event("tickets:update"));
    return data ? toTicket(data as TicketRow) : null;
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert(payload)
    .select(
      "id, event, category, city, date, subtotal, fee, total, order_id, status, buyer_email, purchased_at",
    )
    .maybeSingle();
  if (error) {
    console.error("Failed to save ticket:", error.message);
    return null;
  }
  window.dispatchEvent(new Event("tickets:update"));
  return data ? toTicket(data as TicketRow) : null;
}

export function newOrderId() {
  return "#SLF" + Math.floor(100000 + Math.random() * 899999);
}
