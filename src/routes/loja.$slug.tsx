import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import {
  featuredSerumSlug,
  gelPurificanteSlug,
  hydraBiotecSlug,
  solarVelvetSlug,
  radianceC10Slug,
  esfolianteRenewSlug,
  getProduct,
  products,
} from "@/lib/products";
import { brl, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/site/ProductCard";
import { toast } from "sonner";
import heroDropperUrl from "../assets/hero-dropper-v2.png?url";
import gelPurificanteUrl from "../assets/gel_purificante.png?url";
import hydraBiotecUrl from "../assets/hydra_biotec2.png?url";
import solarVelvetUrl from "../assets/solar_velvet2.png?url";
import radianceC10Url from "../assets/radiance_c10_3.png?url";
import esfolianteRenewUrl from "../assets/esfoliante_renew.png?url";

const productImageUrls: Record<string, string> = {
  [featuredSerumSlug]: heroDropperUrl,
  [gelPurificanteSlug]: gelPurificanteUrl,
  [hydraBiotecSlug]: hydraBiotecUrl,
  [solarVelvetSlug]: solarVelvetUrl,
  [radianceC10Slug]: radianceC10Url,
  [esfolianteRenewSlug]: esfolianteRenewUrl,
};

const productImageClass: Record<string, string> = {
  [featuredSerumSlug]: "h-full w-full scale-[1.16] object-contain",
  [gelPurificanteSlug]: "h-[90%] w-[90%] object-contain",
  [hydraBiotecSlug]: "h-[90%] w-[90%] object-contain",
  [solarVelvetSlug]: "h-[90%] w-[90%] object-contain",
  [radianceC10Slug]: "h-[90%] w-[90%] object-contain",
  [esfolianteRenewSlug]: "h-[90%] w-[90%] object-contain",
};

export const Route = createFileRoute("/loja/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Skinbiome` },
          { name: "description", content: loaderData.product.short },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Produto não encontrado</h1>
      <Link to="/loja" className="mt-6 inline-flex text-primary hover:underline">Voltar à loja</Link>
    </div>
  ),
});

const tints = [
  "from-[oklch(0.94_0.03_150)] to-[oklch(0.86_0.05_150)]",
  "from-[oklch(0.95_0.025_75)] to-[oklch(0.88_0.04_75)]",
  "from-[oklch(0.93_0.04_100)] to-[oklch(0.85_0.06_140)]",
  "from-[oklch(0.88_0.04_45)] to-[oklch(0.80_0.06_25)]",
];

type FakeReview = {
  name: string;
  title: string;
  score: number;
  text: string;
  when: string;
};

function buildProductTint(slug: string): string {
  const hash = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tints[hash % tints.length];
}

function buildFakeReviews(productName: string): FakeReview[] {
  return [
    {
      name: "Marina A.",
      title: "Pele mista",
      score: 5,
      text: `${productName} entrou na minha rotina e senti melhora no toque da pele já na primeira semana.`,
      when: "há 2 dias",
    },
    {
      name: "Juliana R.",
      title: "Pele sensível",
      score: 4,
      text: "Textura excelente, não pesa e combinou com outros ativos sem irritar.",
      when: "há 1 semana",
    },
    {
      name: "Renata P.",
      title: "Pele oleosa",
      score: 5,
      text: "Ótimo custo-benefício. Embalagem linda e resultado visível em poucas aplicações.",
      when: "há 3 semanas",
    },
  ];
}

function ProductVisual({ tint, imageUrl, imageClass, alt }: { tint: string; imageUrl?: string; imageClass?: string; alt: string }) {
  if (imageUrl) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-white">
        <img src={imageUrl} alt={alt} className={imageClass ?? "h-full w-full scale-[1.16] object-contain"} />
      </div>
    );
  }

  return (
    <div className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br ${tint}`}>
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(55% 55% at 50% 35%, white, transparent)" }} />
      <div className="absolute left-1/2 top-[56%] h-[62%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-background/80 shadow-2xl ring-1 ring-foreground/10" />
      <div className="absolute left-1/2 top-[23%] h-[18%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-[45%] bg-background/90 shadow-lg ring-1 ring-foreground/10" />
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < Math.round(value) ? "fill-current" : ""}`} />
      ))}
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.slug !== product.slug && p.line === product.line).slice(0, 4);
  const productTint = buildProductTint(product.slug);
  const fakeReviews = buildFakeReviews(product.name);
  const pixInstallment = product.price / 6;
  const productImageUrl = productImageUrls[product.slug];
  const productImageClassName = productImageClass[product.slug];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs text-muted-foreground">
        <Link to="/loja" className="hover:text-foreground">Loja</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductVisual
          tint={productTint}
          imageUrl={productImageUrl}
          imageClass={productImageClassName}
          alt={product.name}
        />

        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Stars value={product.rating} />
            <span>{product.rating} · {product.reviews} avaliações</span>
          </div>
          <p className="mt-5 text-base text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-3xl font-semibold">{brl(product.price)}</span>
            <span className="text-sm text-muted-foreground">ou 6x de {brl(pixInstallment)} sem juros</span>
            <span className="text-sm text-muted-foreground">ou {brl(product.price * 0.85)} assinando</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Em estoque para envio imediato
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-input">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-muted" aria-label="Diminuir"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2 hover:bg-muted" aria-label="Aumentar"><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => { add({ slug: product.slug, name: product.name, price: product.price }, qty); toast.success("Adicionado ao carrinho"); }}>
              Adicionar ao carrinho
            </Button>
            <Button size="lg" variant="outline" onClick={() => { add({ slug: product.slug, name: product.name, price: product.price, subscribe: true }, qty); toast.success("Assinatura adicionada"); }}>
              Assinar e economizar 15%
            </Button>
          </div>
          <div className="mt-6 grid gap-2 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Frete grátis para compras acima de R$ 149.
            </div>
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Compra segura e devolução em até 7 dias.
            </div>
          </div>

          <Tabs defaultValue="desc" className="mt-10">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto">
              {[["desc","Descrição"],["ing","Ingredientes"],["usar","Como usar"],["aval","Avaliações"]].map(([v,l]) => (
                <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">
                  {l}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="desc" className="pt-6 text-sm text-muted-foreground">{product.description}</TabsContent>
            <TabsContent value="ing" className="pt-6 text-sm text-muted-foreground">{product.ingredients}</TabsContent>
            <TabsContent value="usar" className="pt-6 text-sm text-muted-foreground">{product.howTo}</TabsContent>
            <TabsContent value="aval" className="pt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{product.reviews} avaliações com média {product.rating}/5.</p>
                {fakeReviews.map((review) => (
                  <article key={review.name + review.when} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{review.when}</p>
                    </div>
                    <div className="mt-2">
                      <Stars value={review.score} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
                  </article>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl font-semibold">Combina com</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
