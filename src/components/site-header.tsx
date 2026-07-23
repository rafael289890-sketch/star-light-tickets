import { Link } from "@tanstack/react-router";
import { Ticket, ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow-primary">
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Ticket<span className="text-primary">ou</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="px-3 py-2 rounded-md hover:bg-accent transition"
            activeProps={{ className: "px-3 py-2 rounded-md bg-accent text-primary" }}
            activeOptions={{ exact: true }}
          >
            Comprar
          </Link>
          <Link
            to="/meus-ingressos"
            className="px-3 py-2 rounded-md hover:bg-accent transition inline-flex items-center gap-1.5"
            activeProps={{ className: "px-3 py-2 rounded-md bg-accent text-primary inline-flex items-center gap-1.5" }}
          >
            <ShieldCheck className="w-4 h-4" />
            Meus Ingressos
          </Link>
        </nav>
      </div>
    </header>
  );
}
