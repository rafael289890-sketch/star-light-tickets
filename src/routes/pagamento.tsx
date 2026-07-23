import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { getTickets, saveTicket, type Ticket } from "@/lib/ticket-store";
import { Copy, Check, ShieldCheck, Clock, QrCode, Loader2 } from "lucide-react";
import pixQr from "@/assets/pix-qr.asset.json";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const PIX_CODE =
  "00020101021226820014br.gov.bcb.pix2560qrcode.a55scd.com.br/v1/dccd05a3-025d-47f8-a01a-a55fde1fb3e95204000053039865802BR5914PAYCORPMAXLTDA6008SAOPAULO62070503***6304281F";

const searchSchema = z.object({ order: z.string().optional() });

export const Route = createFileRoute("/pagamento")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Pagamento Pix · Starlight Festival | Ticketou" },
      { name: "description", content: "Efetue o pagamento via Pix para liberar o ingresso." },
    ],
  }),
  component: Payment,
});

function Payment() {
  const { order } = Route.useSearch();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    const list = getTickets();
    const t = list.find((x) => x.orderId === order) || list[list.length - 1];
    if (!t) {
      navigate({ to: "/ingresso" });
      return;
    }
    setTicket(t);
  }, [order, navigate]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const time = useMemo(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [seconds]);

  const copy = async () => {
    await navigator.clipboard.writeText(PIX_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const confirm = () => {
    if (!ticket) return;
    setConfirming(true);
    setTimeout(() => {
      saveTicket({ ...ticket, status: "paid", purchasedAt: new Date().toISOString() });
      navigate({ to: "/meus-ingressos", search: { order: ticket.orderId } });
    }, 2200);
  };

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">Passo 2 de 3</div>
            <h1 className="mt-2 text-3xl font-bold">Pague via Pix</h1>
            <p className="text-muted-foreground mt-1">
              Pedido {ticket.orderId} · liberação automática após confirmação
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">Expira em</span>
            <span className="font-mono font-bold text-lg">{time}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <QrCode className="w-4 h-4 text-primary" /> Escaneie o QR Code
            </div>

            <div className="rounded-xl bg-white p-4 flex items-center justify-center">
              <img src={pixQr.url} alt="QR Code Pix" className="w-full max-w-[280px] aspect-square object-contain" />
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold mb-2">Ou copie o código Pix (Copia e Cola)</div>
              <div className="rounded-lg bg-background border border-border p-3 text-xs font-mono break-all text-muted-foreground max-h-28 overflow-auto">
                {PIX_CODE}
              </div>
              <button
                onClick={copy}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/10 text-primary font-semibold px-4 py-3 hover:bg-primary/20 transition"
              >
                {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar código Pix</>}
              </button>
            </div>

            <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground bg-background rounded-lg p-3 border border-border">
              <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p>
                Pagamento processado por <b className="text-foreground">PAYCORPMAX LTDA</b> em ambiente
                seguro. Após a confirmação, o ingresso será enviado ao e-mail
                <b className="text-foreground"> {ticket.buyerEmail}</b> e aparecerá em "Meus Ingressos".
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold">Resumo</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Evento" value={ticket.event} />
                <Row label="Categoria" value={ticket.category} />
                <Row label="Data" value={ticket.date} />
                <Row label="Local" value={ticket.city} />
                <div className="border-t border-border my-2" />
                <Row label="Subtotal" value={`R$ ${ticket.subtotal.toFixed(2)}`} />
                <Row label="Taxa Ticketou" value={`R$ ${ticket.fee.toFixed(2)}`} />
                <div className="border-t border-dashed border-border my-2" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">R$ {ticket.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={confirm}
              disabled={confirming}
              className="w-full rounded-xl bg-success text-success-foreground font-semibold px-6 py-4 inline-flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-70"
            >
              {confirming ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Verificando pagamento...</>
              ) : (
                <><Check className="w-4 h-4" /> Já efetuei o pagamento</>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Clique após efetuar o Pix para verificação automática.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
