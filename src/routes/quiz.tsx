import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz da Pele — Skinbiome" },
      { name: "description", content: "Em 2 minutos, descubra sua rotina ideal de skincare personalizada por IA." },
    ],
  }),
  component: QuizPage,
});

type Answers = {
  skin?: string;
  concerns: string[];
  routine?: string;
  spf?: string;
  allergies?: string;
  age?: string;
  name?: string;
  email?: string;
};

const steps = 7;

function QuizPage() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({ concerns: [] });
  const [done, setDone] = useState(false);

  const next = () => setStep((s) => Math.min(steps - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (done) return <Result answers={a} />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-20">
      <Progress value={((step + 1) / steps) * 100} className="h-1" />
      <div className="mt-2 text-xs text-muted-foreground">Etapa {step + 1} de {steps}</div>

      <div key={step} className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step === 0 && (
          <Question title="Qual é o seu tipo de pele?">
            <Choices options={["seca", "oleosa", "mista", "normal", "sensível"]} value={a.skin} onChange={(v) => setA({ ...a, skin: v })} />
          </Question>
        )}
        {step === 1 && (
          <Question title="Quais são suas principais preocupações?" hint="Selecione quantas quiser.">
            <Choices multi options={["acne", "manchas", "rugas", "oleosidade", "ressecamento", "sensibilidade"]} values={a.concerns} onMultiChange={(vs) => setA({ ...a, concerns: vs })} />
          </Question>
        )}
        {step === 2 && (
          <Question title="Qual é a sua rotina atual?">
            <Choices options={["nenhuma", "básica", "avançada"]} value={a.routine} onChange={(v) => setA({ ...a, routine: v })} />
          </Question>
        )}
        {step === 3 && (
          <Question title="Você usa protetor solar diariamente?">
            <Choices options={["sim", "às vezes", "não"]} value={a.spf} onChange={(v) => setA({ ...a, spf: v })} />
          </Question>
        )}
        {step === 4 && (
          <Question title="Alguma alergia ou intolerância?" hint="Campo opcional.">
            <Textarea value={a.allergies ?? ""} onChange={(e) => setA({ ...a, allergies: e.target.value })} placeholder="Ex: fragrância, ácido salicílico..." />
          </Question>
        )}
        {step === 5 && (
          <Question title="Qual sua faixa etária?">
            <Choices options={["abaixo de 18", "18–25", "26–35", "36–45", "acima de 45"]} value={a.age} onChange={(v) => setA({ ...a, age: v })} />
          </Question>
        )}
        {step === 6 && (
          <Question title="Pra onde mandamos seu resultado?">
            <div className="space-y-4">
              <div>
                <Label htmlFor="n">Nome</Label>
                <Input id="n" value={a.name ?? ""} onChange={(e) => setA({ ...a, name: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="e">E-mail</Label>
                <Input id="e" type="email" value={a.email ?? ""} onChange={(e) => setA({ ...a, email: e.target.value })} className="mt-1.5" />
              </div>
            </div>
          </Question>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>Voltar</Button>
        {step < steps - 1 ? (
          <Button onClick={next} disabled={
            (step === 0 && !a.skin) ||
            (step === 1 && a.concerns.length === 0) ||
            (step === 2 && !a.routine) ||
            (step === 3 && !a.spf) ||
            (step === 5 && !a.age)
          }>Próximo</Button>
        ) : (
          <Button onClick={() => { if (!a.name || !a.email) { toast.error("Preencha nome e e-mail"); return; } setDone(true); }}>
            Ver meu resultado
          </Button>
        )}
      </div>
    </div>
  );
}

function Question({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Choices({ options, value, onChange, multi, values, onMultiChange }: {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  multi?: boolean;
  values?: string[];
  onMultiChange?: (v: string[]) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const active = multi ? values?.includes(o) : value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => {
              if (multi && onMultiChange) {
                onMultiChange(values?.includes(o) ? values.filter((x) => x !== o) : [...(values ?? []), o]);
              } else onChange?.(o);
            }}
            className={`rounded-xl border px-5 py-4 text-left text-sm capitalize transition-all ${
              active ? "border-primary bg-primary/5 text-foreground" : "border-border hover:border-foreground/30 text-muted-foreground"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Result({ answers }: { answers: Answers }) {
  const { add } = useCart();
  // Pick products matching skin + concerns
  const recs = products
    .filter((p) =>
      (!answers.skin || p.skinTypes.some((s) => answers.skin?.replace("â","a").includes(s)) || true) &&
      (answers.concerns.length === 0 || p.concerns.some((c) => answers.concerns.includes(c)))
    )
    .slice(0, 4);
  const morning = recs.slice(0, 2);
  const night = recs.slice(2, 4);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
      <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-primary">Seu perfil</span>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
        {answers.name?.split(" ")[0] ?? "Você"}, sua pele é <span className="text-primary">{answers.skin ?? "personalizada"}</span>
        {answers.concerns.length > 0 && <> com tendência a {answers.concerns[0]}</>}.
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Hidratação", v: answers.skin === "seca" ? 35 : 60 },
          { l: "Uniformidade", v: answers.concerns.includes("manchas") ? 40 : 65 },
          { l: "Proteção", v: answers.spf === "sim" ? 80 : answers.spf === "às vezes" ? 50 : 25 },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border p-5">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-2xl font-semibold">{s.v}%</div>
            <Progress value={s.v} className="mt-3 h-1.5" />
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <RoutineCard title="Rotina da manhã" items={morning} />
        <RoutineCard title="Rotina da noite" items={night} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => {
          recs.forEach((p) => add({ slug: p.slug, name: p.name, price: p.price }));
          toast.success("Tudo adicionado ao carrinho");
        }}>Adicionar tudo ao carrinho</Button>
        <Button asChild size="lg" variant="outline"><Link to="/loja">Explorar mais</Link></Button>
      </div>
    </div>
  );
}

function RoutineCard({ title, items }: { title: string; items: typeof products }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="text-sm font-medium">{title}</div>
      <ul className="mt-4 space-y-3">
        {items.map((p) => (
          <li key={p.slug} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-gradient-to-br from-[oklch(0.92_0.04_150)] to-[oklch(0.86_0.05_150)]" />
            <Link to="/loja/$slug" params={{ slug: p.slug }} className="text-sm font-medium hover:underline">{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
