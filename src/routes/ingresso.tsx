import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/lib/auth";
import { TICKET_OPTION, saveTicket, newOrderId } from "@/lib/ticket-store";
import { Calendar, MapPin, Ticket as TicketIcon, Check, ArrowRight, Mail, Loader2 } from "lucide-react";

export const Route = createFileRoute("/ingresso")({
  head: () => ({
    meta: [
      { title: "Selecionar ingresso · Starlight Festival | Ticketou" },
      { name: "description", content: "Selecione o ingresso Frontstage Inteira disponível para revenda." },
    ],
  }),
  component: SelectTicket,
});

function SelectTicket() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/entrar" });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const proceed = async () => {
    if (!selected || !email) return;
    setSubmitting(true);
    const orderId = newOrderId();
    await saveTicket({
      ...TICKET_OPTION,
      orderId,
      status: "pending",
      buyerEmail: email,
    });
    setSubmitting(false);
    navigate({ to: "/pagamento", search: { order: orderId } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">Passo 1 de 3</div>
          <h1 className="mt-2 text-3xl font-bold">Ingresso disponível para revenda</h1>
          <p className="text-muted-foreground mt-2">
            Apenas 1 convite foi disponibilizado pelo vendedor original. Selecione para continuar.
          </p>
        </div>

        <button
          onClick={() => setSelected((s) => !s)}
          className={`w-full text-left ticket-shape p-1 transition-all ${
            selected ? "ring-2 ring-primary glow-primary scale-[1.01]" : "hover:scale-[1.005]"
          }`}
        >
          <div className="rounded-[0.9rem] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary text-xs font-semibold px-2.5 py-1">
                  <TicketIcon className="w-3.5 h-3.5" /> FRONTSTAGE - INTEIRA
                </div>
                <h3 className="mt-3 text-xl font-bold">Starlight Festival</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/80">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 22/08/2026</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Brasília - DF</span>
                </div>
              </div>
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                  selected ? "bg-primary border-primary text-primary-foreground" : "border-white/40"
                }`}
              >
                {selected && <Check className="w-4 h-4" />}
              </div>
            </div>

            <div className="mt-5 border-t border-dashed border-white/15 pt-4 flex items-end justify-between">
              <div className="text-sm text-white/70">
                <div>Subtotal: <span className="text-white font-semibold">R$ 250,00</span></div>
                <div>Taxa Ticketou: <span className="text-white font-semibold">R$ 25,00</span></div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">Total</div>
                <div className="text-2xl font-bold">R$ 275,00</div>
              </div>
            </div>
          </div>
        </button>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            E-mail do comprador
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            O ingresso será enviado automaticamente para este e-mail após a confirmação do pagamento.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="mt-3 w-full rounded-lg bg-background border border-border px-4 py-3 outline-none focus:border-primary transition"
          />
        </div>

        <button
          onClick={proceed}
          disabled={!selected || !email || submitting}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Ir para pagamento Pix<ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}
