import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { brl, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Skinbiome" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, toggleSubscribe, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 19.9;
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Seu carrinho está vazio</h1>
        <p className="mt-3 text-muted-foreground">Que tal começar pelo nosso quiz?</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild><Link to="/quiz">Fazer quiz</Link></Button>
          <Button asChild variant="outline"><Link to="/loja">Ver loja</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Seu carrinho</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {items.map((i) => (
            <li key={i.slug} className="flex gap-4 p-5">
              <div className="h-24 w-24 shrink-0 rounded-md bg-gradient-to-br from-[oklch(0.92_0.04_150)] to-[oklch(0.86_0.05_150)]" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{brl(i.subscribe ? i.price * 0.85 : i.price)} un.</div>
                  </div>
                  <button onClick={() => remove(i.slug)} className="text-muted-foreground hover:text-foreground" aria-label="Remover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-md border border-input">
                    <button onClick={() => setQty(i.slug, i.quantity - 1)} className="p-1.5 hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm">{i.quantity}</span>
                    <button onClick={() => setQty(i.slug, i.quantity + 1)} className="p-1.5 hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id={`sub-${i.slug}`} checked={i.subscribe ?? false} onCheckedChange={() => toggleSubscribe(i.slug)} />
                    <Label htmlFor={`sub-${i.slug}`} className="text-xs text-muted-foreground">Assinar (-15%)</Label>
                  </div>
                  <div className="text-sm font-semibold">{brl((i.subscribe ? i.price * 0.85 : i.price) * i.quantity)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-background p-6">
          <h2 className="font-display text-lg font-semibold">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={brl(subtotal)} />
            {discount > 0 && <Row label="Desconto" value={`- ${brl(discount)}`} />}
            <Row label="Frete" value={shipping === 0 ? "Grátis" : brl(shipping)} />
            <div className="my-3 h-px bg-border" />
            <Row label="Total" value={brl(total)} bold />
          </dl>

          <div className="mt-5">
            <Label htmlFor="cupom" className="text-xs">Cupom de desconto</Label>
            <div className="mt-1.5 flex gap-2">
              <Input id="cupom" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="SKIN10" />
              <Button variant="outline" onClick={() => {
                if (coupon.trim().toUpperCase() === "SKIN10") { setDiscount(subtotal * 0.1); toast.success("Cupom aplicado: 10% off"); }
                else { setDiscount(0); toast.error("Cupom inválido"); }
              }}>Aplicar</Button>
            </div>
          </div>

          <Button asChild size="lg" className="mt-6 w-full"><Link to="/checkout">Finalizar compra</Link></Button>
          {subtotal < 150 && <p className="mt-3 text-xs text-muted-foreground">Faltam {brl(150 - subtotal)} para o frete grátis.</p>}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold text-foreground" : "text-muted-foreground"}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
