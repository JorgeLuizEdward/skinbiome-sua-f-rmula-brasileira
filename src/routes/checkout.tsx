import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { brl, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Skinbiome" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [payment, setPayment] = useState("card");
  const navigate = useNavigate();

  if (items.length === 0 && !orderId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Sem itens para finalizar</h1>
        <Button asChild className="mt-6"><Link to="/loja">Ir à loja</Link></Button>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in duration-500">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">Pedido confirmado!</h1>
        <p className="mt-3 text-muted-foreground">Número do pedido: <span className="font-medium text-foreground">#{orderId}</span></p>
        <p className="mt-1 text-sm text-muted-foreground">Enviamos um e-mail com todos os detalhes.</p>
        <Button asChild className="mt-8" onClick={() => navigate({ to: "/" })}><Link to="/">Voltar para o início</Link></Button>
      </div>
    );
  }

  const steps = ["Identificação", "Endereço", "Pagamento"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Checkout</h1>

      <ol className="mt-8 flex items-center gap-4 text-sm">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
            <span className={i === step ? "font-medium text-foreground" : "text-muted-foreground"}>{s}</span>
            {i < steps.length - 1 && <span className="ml-2 h-px w-8 bg-border" />}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form
          className="space-y-5 rounded-2xl border border-border bg-background p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 2) setStep(step + 1);
            else { setOrderId(Math.random().toString(36).slice(2, 9).toUpperCase()); clear(); }
          }}
        >
          {step === 0 && (
            <>
              <Field label="Nome completo" required />
              <Field label="E-mail" type="email" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="CPF" required />
                <Field label="Telefone" required />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <Field label="CEP" required />
              <Field label="Rua" required />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Número" required />
                <Field label="Complemento" />
                <Field label="Bairro" required />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Cidade" required />
                <Field label="Estado" required />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-3 sm:grid-cols-3">
                {[["card","Cartão"],["pix","Pix"],["boleto","Boleto"]].map(([v,l]) => (
                  <label key={v} className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-3 text-sm ${payment===v ? "border-primary bg-primary/5" : "border-input"}`}>
                    <RadioGroupItem value={v} />
                    {l}
                  </label>
                ))}
              </RadioGroup>
              {payment === "card" && (
                <div className="space-y-5 pt-2">
                  <Field label="Número do cartão" required />
                  <Field label="Nome no cartão" required />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Validade (MM/AA)" required />
                    <Field label="CVV" required />
                  </div>
                </div>
              )}
              {payment === "pix" && <p className="text-sm text-muted-foreground">QR Code Pix será gerado ao confirmar o pedido.</p>}
              {payment === "boleto" && <p className="text-sm text-muted-foreground">Boleto com vencimento em 3 dias úteis.</p>}
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Voltar</Button>
            <Button type="submit">{step < 2 ? "Continuar" : "Confirmar pedido"}</Button>
          </div>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-background p-6 text-sm">
          <h2 className="font-display text-lg font-semibold">Resumo</h2>
          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li key={i.slug} className="flex justify-between text-muted-foreground">
                <span>{i.quantity}× {i.name}</span>
                <span>{brl((i.subscribe ? i.price * 0.85 : i.price) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{brl(subtotal + (subtotal >= 150 ? 0 : 19.9))}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  const id = label.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <div>
      <Label htmlFor={id}>{label}{required && " *"}</Label>
      <Input id={id} type={type} required={required} className="mt-1.5" />
    </div>
  );
}
