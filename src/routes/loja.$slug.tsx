import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import { getProduct, products } from "@/lib/products";
import { brl, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/site/ProductCard";
import { toast } from "sonner";

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
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.slug !== product.slug && p.line === product.line).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs text-muted-foreground">
        <Link to="/loja" className="hover:text-foreground">Loja</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <div className={`aspect-square w-full rounded-2xl bg-gradient-to-br ${tints[0]} flex items-center justify-center`}>
            <div className="h-2/3 w-1/3 rounded-full bg-background/80 shadow-xl ring-1 ring-foreground/5" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {tints.map((t, i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${t}`} />
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />
              ))}
            </div>
            <span>{product.rating} · {product.reviews} avaliações</span>
          </div>
          <p className="mt-5 text-base text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">{brl(product.price)}</span>
            <span className="text-sm text-muted-foreground">ou {brl(product.price * 0.85)} assinando</span>
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
            <TabsContent value="aval" className="pt-6 text-sm text-muted-foreground">
              {product.reviews} avaliações com média {product.rating}/5.
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
