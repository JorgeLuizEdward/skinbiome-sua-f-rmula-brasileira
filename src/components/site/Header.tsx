import { Link } from "@tanstack/react-router";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import brandLogoFullUrl from "../../assets/brand-logo-full.png?url";

const nav = [
  { to: "/", label: "Início" },
  { to: "/loja", label: "Loja" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/kits", label: "Kits" },
  { to: "/quiz", label: "Quiz" },
];

export function Header() {
  const { count } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const firstName = user?.name?.trim().split(/\s+/)[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-32 max-w-7xl items-center justify-between px-4 sm:h-36 sm:px-6 lg:px-8">
        <Link to="/" className="-mt-2 inline-flex items-center bg-transparent">
          <img
            src={brandLogoFullUrl}
            alt="Skinnova Beleza Facial"
            className="h-[12.25rem] w-auto bg-transparent object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/quiz">Fazer meu quiz</Link>
          </Button>
          <Link to="/conta" aria-label="Conta" className="relative inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground hover:bg-muted">
            <User className="h-5 w-5" />
            {isAuthenticated && firstName && (
              <span className="hidden max-w-[92px] truncate text-sm font-medium sm:inline">
                {firstName}
              </span>
            )}
            {isAuthenticated && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />}
          </Link>
          <Link to="/carrinho" aria-label="Carrinho" className="relative rounded-md p-2 text-foreground hover:bg-muted">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-md p-2 text-foreground hover:bg-muted md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link to="/quiz" onClick={() => setOpen(false)}>Fazer meu quiz</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
