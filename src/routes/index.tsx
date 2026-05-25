import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, FlaskConical, Leaf, Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skinbiome — Skincare feito para a sua pele" },
      { name: "description", content: "Quiz gratuito e rotinas personalizadas por IA. Skincare biotecnológico para a pele brasileira." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-beige px-3 py-1 text-xs font-medium text-beige-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Biotecnologia + IA
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Skincare feito para a sua pele.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              Biotecnologia + IA para criar a sua rotina perfeita, com ingredientes brasileiros e fórmulas que respeitam a microbiota da sua pele.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/quiz">Fazer quiz grátis</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/loja">Ver produtos</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-[oklch(0.92_0.04_150)] via-[oklch(0.94_0.03_120)] to-[oklch(0.88_0.05_80)]">
              <div className="absolute left-1/2 top-1/2 h-3/5 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 shadow-2xl ring-1 ring-foreground/5" />
              <div className="absolute right-8 top-12 h-20 w-20 rounded-full bg-accent/40 blur-xl" />
              <div className="absolute bottom-10 left-8 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">Em três passos simples você tem uma rotina pensada só pra você.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Faça o quiz", d: "Analisamos sua pele em 2 minutos." },
              { n: "02", t: "Receba sua rotina", d: "Produtos selecionados pela nossa IA." },
              { n: "03", t: "Assine e economize", d: "Kits mensais com até 15% off." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-background p-8">
                <div className="text-xs font-medium text-accent">{s.n}</div>
                <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/quiz" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
              Começar meu quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Mais vendidos</h2>
            <p className="mt-2 text-muted-foreground">Os queridinhos de quem já encontrou sua fórmula.</p>
          </div>
          <Link to="/loja" className="hidden text-sm font-medium text-primary hover:underline sm:block">Ver tudo</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Por que Skinbiome</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: FlaskConical, t: "Biotecnologia", d: "Ativos fermentados de alta performance." },
              { i: Sparkles, t: "IA para sua pele", d: "Rotinas personalizadas pelo nosso algoritmo." },
              { i: Leaf, t: "Ingredientes brasileiros", d: "Açaí, copaíba, guaraná e cupuaçu." },
              { i: Heart, t: "Cruelty-free & eco", d: "Sem testes em animais, embalagens recicláveis." },
            ].map((d, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <d.i className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-lg font-semibold">{d.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Quem usa, ama.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "Camila R.", t: "Pele mista", r: 5, q: "Em 3 semanas minha oleosidade caiu visivelmente. O sérum de niacinamida virou indispensável." },
            { n: "Beatriz M.", t: "Pele seca", r: 5, q: "Finalmente uma marca que entende pele brasileira. O hidratante com AH é incrível." },
            { n: "Júlia P.", t: "Pele oleosa", r: 4, q: "O quiz acertou em cheio. A rotina chegou e em 1 mês já vi diferença nos poros." },
          ].map((t) => (
            <figure key={t.n} className="rounded-2xl border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/30 font-semibold text-primary">
                  {t.n[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.t}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5 text-accent">
                {Array.from({ length: t.r }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-3 text-sm text-foreground">"{t.q}"</blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* Banner assinatura */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground sm:px-12 lg:px-16">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Assine e receba sua rotina todo mês por R$ 99/mês.
              </h2>
              <p className="mt-3 max-w-md text-primary-foreground/80">
                Frete grátis, 15% de desconto e flexibilidade para pausar quando quiser.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Button asChild size="lg" variant="secondary">
                <Link to="/kits">Quero assinar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
