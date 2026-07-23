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

export function getTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveTicket(t: Ticket) {
  if (typeof window === "undefined") return;
  const list = getTickets().filter((x) => x.orderId !== t.orderId);
  list.push(t);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("tickets:update"));
}

export function newOrderId() {
  return "#SLF" + Math.floor(100000 + Math.random() * 899999);
}
