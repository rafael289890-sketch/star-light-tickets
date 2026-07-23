import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/lib/auth";
import { Calendar, MapPin, ShieldCheck, Zap, Users, ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Starlight Festival Brasília · Revenda Segura | Ticketou" },
      { name: "description", content: "Compre com segurança seu ingresso Frontstage do Starlight Festival Brasília 22/08 via intermediação Ticketou." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.15_275/0.6),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_80%,oklch(0.87_0.19_118/0.15),transparent_40%)]" />

        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> Intermediação segura de revenda
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Starlight Festival
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-emerald-300 bg-clip-text text-transparent">
              Brasília · 22/08
            </span>
          </h1>
          <p className="mt-5 text-muted-foreground text-lg max-w-xl">
            Um vendedor confiou a você um ingresso em segunda mão. Complete o pagamento
            aqui e ele será enviado automaticamente para o e-mail do comprador.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link
                to="/ingresso"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-primary-foreground font-semibold animate-pulse-glow hover:scale-[1.02] transition"
              >
                Selecionar ingresso existente
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            ) : (
              <Link
                to="/entrar"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-primary-foreground font-semibold animate-pulse-glow hover:scale-[1.02] transition"
              >
                Entrar para comprar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            )}
            <Link
              to="/meus-ingressos"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-4 font-semibold hover:bg-accent transition"
            >
              <ShieldCheck className="w-4 h-4" /> Meus Ingressos
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoCard icon={<Calendar className="w-4 h-4" />} label="Data" value="22 Ago" />
            <InfoCard icon={<MapPin className="w-4 h-4" />} label="Local" value="Brasília - DF" />
            <InfoCard icon={<Users className="w-4 h-4" />} label="Setor" value="Frontstage" />
            <InfoCard icon={<Zap className="w-4 h-4" />} label="Entrega" value="Automática" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-4">
        {[
          {
            icon: <ShieldCheck className="w-5 h-5" />,
            title: "Pagamento protegido",
            body: "O vendedor só recebe após você confirmar o recebimento do ingresso.",
          },
          {
            icon: <Zap className="w-5 h-5" />,
            title: "Ingresso instantâneo",
            body: "Assim que o Pix for confirmado, o QR Code é liberado automaticamente.",
          },
          {
            icon: <Star className="w-5 h-5" />,
            title: "Evento verificado",
            body: "Starlight Festival · edição Brasília, 22 de agosto. Validade garantida.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-3">
              {f.icon}
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
