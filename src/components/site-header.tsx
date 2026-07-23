import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Ticket, ShieldCheck, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

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

          {user ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-accent transition"
              >
                <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {user.email?.charAt(0).toUpperCase() ?? <UserIcon className="w-4 h-4" />}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-border">
                    <div className="text-xs text-muted-foreground">Conectado como</div>
                    <div className="text-sm font-semibold truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition inline-flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/entrar"
              className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-2 font-semibold hover:brightness-110 transition"
              activeProps={{ className: "ml-1 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-2 font-semibold brightness-110" }}
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
