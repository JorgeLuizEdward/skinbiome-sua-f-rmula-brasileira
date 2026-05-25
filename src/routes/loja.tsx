import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Loja — Skinbiome" },
      { name: "description", content: "Skincare biotecnológico com ingredientes brasileiros." },
    ],
  }),
  component: LojaPage,
});

const skinTypes = ["seca", "oleosa", "mista", "normal", "sensivel"];
const concerns = ["acne", "manchas", "rugas", "oleosidade", "ressecamento", "sensibilidade"];
const lines = ["Limpeza", "Tratamento", "Hidratação", "Proteção", "Corpo"];

function LojaPage() {
  const [skin, setSkin] = useState<string[]>([]);
  const [conc, setConc] = useState<string[]>([]);
  const [line, setLine] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(150);

  const filtered = useMemo(() =>
    products.filter((p) =>
      (skin.length === 0 || p.skinTypes.some((s) => skin.includes(s))) &&
      (conc.length === 0 || p.concerns.some((c) => conc.includes(c))) &&
      (line.length === 0 || line.includes(p.line)) &&
      p.price <= price
    ), [skin, conc, line, price]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Nossa loja</h1>
        <p className="mt-3 text-muted-foreground">Skincare biotec com ingredientes brasileiros, formulado para cada tipo de pele.</p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <FilterGroup title="Tipo de pele">
            {skinTypes.map((s) => (
              <Row key={s} label={s} checked={skin.includes(s)} onChange={() => toggle(skin, setSkin, s)} />
            ))}
          </FilterGroup>
          <FilterGroup title="Preocupação">
            {concerns.map((c) => (
              <Row key={c} label={c} checked={conc.includes(c)} onChange={() => toggle(conc, setConc, c)} />
            ))}
          </FilterGroup>
          <FilterGroup title="Linha">
            {lines.map((l) => (
              <Row key={l} label={l} checked={line.includes(l)} onChange={() => toggle(line, setLine, l)} />
            ))}
          </FilterGroup>
          <FilterGroup title={`Até R$ ${price}`}>
            <Slider value={[price]} min={40} max={200} step={10} onValueChange={([v]) => setPrice(v)} />
          </FilterGroup>
        </aside>

        <section>
          <div className="mb-6 text-sm text-muted-foreground">{filtered.length} produto(s)</div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-sm font-medium">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  const id = `f-${label}`;
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm capitalize text-muted-foreground">{label}</Label>
    </div>
  );
}
