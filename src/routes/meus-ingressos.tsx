import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/lib/auth";
import { getTickets, type Ticket } from "@/lib/ticket-store";
import { Calendar, MapPin, CheckCircle2, Ticket as TicketIcon, QrCode, Sparkles, Loader2 } from "lucide-react";
import pixQr from "@/assets/pix-qr.asset.json";

const searchSchema = z.object({ order: z.string().optional() });

export const Route = createFileRoute("/meus-ingressos")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Meus Ingressos · Ticketou" },
      { name: "description", content: "Seus ingressos confirmados para o Starlight Festival." },
    ],
  }),
  component: MyTickets,
});

function MyTickets() {
  const { order } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/entrar" });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      const list = await getTickets();
      if (!active) return;
      setTickets(list.filter((t) => t.status === "paid"));
      setLoadingTickets(false);
    };
    load();
    const onUpdate = () => load();
    window.addEventListener("tickets:update", onUpdate);
    return () => {
      active = false;
      window.removeEventListener("tickets:update", onUpdate);
    };
  }, [user]);

  useEffect(() => {
    if (order && tickets.find((t) => t.orderId === order)) {
      setShowCelebration(true);
      const id = setTimeout(() => setShowCelebration(false), 3500);
      return () => clearTimeout(id);
    }
  }, [order, tickets]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {showCelebration && (
          <div className="mb-6 rounded-2xl border border-success/40 bg-success/10 p-5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
            <div>
              <div className="font-semibold text-success flex items-center gap-2">
                Pagamento confirmado! <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Seu ingresso Frontstage Inteira foi liberado e enviado para o seu e-mail.
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meus Ingressos</h1>
          <p className="text-muted-foreground mt-1">
            Todos os seus ingressos confirmados. Apresente o QR Code na entrada do evento.
          </p>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <TicketIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold">Nenhum ingresso ainda</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Assim que você finalizar a compra, seu ingresso aparecerá aqui.
            </p>
            <Link
              to="/ingresso"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 font-semibold hover:brightness-110 transition"
            >
              Ver ingressos disponíveis
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((t) => (
              <TicketCard key={t.orderId} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TicketCard({ t }: { t: Ticket }) {
  return (
    <div className="ticket-shape p-1 glow-primary">
      <div className="rounded-[0.9rem] p-5 md:p-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-success/20 text-success text-xs font-bold px-2.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAGO
            </div>
            <h3 className="mt-3 text-2xl font-bold text-white">{t.event}</h3>
            <div className="mt-1 text-primary font-semibold">{t.category}</div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {t.date}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {t.city}</span>
            </div>

            <div className="mt-5 border-t border-dashed border-white/15 pt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-white/60 text-xs">Pedido</div>
                <div className="text-white font-mono font-semibold">{t.orderId}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs">Total pago</div>
                <div className="text-white font-bold">R$ {t.total.toFixed(2)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-white/60 text-xs">Enviado para</div>
                <div className="text-white font-semibold truncate">{t.buyerEmail}</div>
              </div>
            </div>
          </div>

          <div className="justify-self-center md:justify-self-end">
            <div className="rounded-xl bg-white p-3">
              <img src={pixQr.url} alt="QR do ingresso" className="w-40 h-40 object-contain" />
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-white/70">
              <QrCode className="w-3.5 h-3.5" /> QR Code de entrada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
