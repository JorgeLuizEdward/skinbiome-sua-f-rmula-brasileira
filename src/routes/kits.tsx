import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { kits } from "@/lib/products";
import { brl, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/kits")({
  head: () => ({
    meta: [
      { title: "Kits — Skinbiome" },
      { name: "description", content: "Rotinas completas com economia: kits Skinbiome para cada necessidade da pele." },
    ],
  }),
  component: KitsPage,
});

function KitsPage() {
  const { add } = useCart();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Kits Skinbiome</h1>
        <p className="mt-3 text-muted-foreground">Rotinas completas pensadas pra resolver, com economia.</p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {kits.map((k) => {
          const sum = k.itemPrices.reduce((a, b) => a + b, 0);
          const save = sum - k.price;
          return (
            <article key={k.slug} className="flex flex-col rounded-2xl border border-border bg-background p-8">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[oklch(0.92_0.04_150)] to-[oklch(0.85_0.05_80)]" />
              <h2 className="mt-6 font-display text-2xl font-semibold">{k.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{k.description}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {k.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <div className="font-display text-2xl font-semibold">{brl(k.price)}</div>
                  <div className="text-xs text-muted-foreground line-through">{brl(sum)}</div>
                </div>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-primary">Economize {brl(save)}</span>
              </div>
              <Button
                className="mt-6"
                onClick={() => {
                  add({ slug: k.slug, name: k.name, price: k.price });
                  toast.success("Kit adicionado ao carrinho");
                }}
              >
                Comprar kit
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
