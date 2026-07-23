import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Ticket, ShieldCheck, Loader2, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar · Starlight Festival | Ticketou" },
      { name: "description", content: "Acesse sua conta ou crie uma nova para comprar e gerenciar seus ingressos." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/meus-ingressos" });
    }
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError(null);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.15_275/0.6),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_80%,oklch(0.87_0.19_118/0.15),transparent_40%)]" />

        <div className="relative max-w-md mx-auto px-4 py-12 md:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o início
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Ticket<span className="text-primary">ou</span>
            </span>
          </div>

          <div className="ticket-shape p-1 glow-primary">
            <div className="rounded-[0.9rem] p-6 md:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary text-xs font-semibold px-2.5 py-1 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Acesso seguro
              </div>

              <h1 className="text-2xl font-bold">
                {mode === "signin" ? "Entrar na conta" : "Criar conta"}
              </h1>
              <p className="text-sm text-white/70 mt-1">
                {mode === "signin"
                  ? "Acesse para comprar e gerenciar seus ingressos."
                  : "Cadastre-se para começar a comprar com segurança."}
              </p>

              <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className="mt-2 w-full rounded-lg bg-background/60 border border-white/15 px-4 py-3 outline-none focus:border-primary transition placeholder:text-white/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Senha
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="mt-2 w-full rounded-lg bg-background/60 border border-white/15 px-4 py-3 outline-none focus:border-primary transition placeholder:text-white/40"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signin" ? "Entrar" : "Criar conta"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 border-t border-dashed border-white/15 pt-4 text-center">
                <p className="text-sm text-white/70">
                  {mode === "signin" ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
                  <button
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setError(null);
                    }}
                    className="text-primary font-semibold hover:brightness-110 transition"
                  >
                    {mode === "signin" ? "Criar agora" : "Entrar"}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Seus ingressos ficam vinculados à sua conta e seguros em qualquer dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}
