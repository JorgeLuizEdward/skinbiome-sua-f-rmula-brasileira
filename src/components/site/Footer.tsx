import { Link } from "@tanstack/react-router";
import { Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="font-display text-xl font-semibold">
            Skinbiome<span className="text-accent">.</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Sua pele, sua fórmula. Biotecnologia + IA para a pele brasileira.</p>
        </div>
        <FooterCol title="Skinbiome" links={[["Sobre","/sobre"],["Blog","/blog"],["FAQ","/faq"],["Contato","/contato"]]} />
        <FooterCol title="Ajuda" links={[["Política de privacidade","/privacidade"],["Termos","/termos"],["Trocas","/trocas"]]} />
        <div>
          <div className="text-sm font-medium">Siga</div>
          <div className="mt-3 flex gap-3 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="TikTok" className="hover:text-foreground text-sm font-semibold pt-0.5">TikTok</a>
            <a href="#" aria-label="YouTube" className="hover:text-foreground"><Youtube className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © 2025 Skinbiome. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={to}><Link to={to} className="hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
