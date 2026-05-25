import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — Skinbiome" },
      { name: "description", content: "Da análise da pele à entrega da sua rotina personalizada por IA." },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Como funciona</h1>
        <p className="mt-4 text-lg text-muted-foreground">Tecnologia simples, resultados reais. Veja como cuidamos da sua pele em 3 etapas.</p>
      </header>

      <ol className="mt-16 space-y-12">
        {[
          { n: "01", t: "Faça o quiz", d: "Em 2 minutos respondemos perguntas-chave sobre seu tipo de pele, rotina e objetivos. Nada de jargão." },
          { n: "02", t: "IA monta sua rotina", d: "Nosso algoritmo cruza seus dados com a eficácia clínica dos ativos e seleciona os produtos certos para você." },
          { n: "03", t: "Receba em casa", d: "Compra avulsa ou assinatura mensal com 15% off. Pause ou cancele quando quiser." },
        ].map((s) => (
          <li key={s.n} className="grid gap-6 sm:grid-cols-[auto_1fr]">
            <div className="font-display text-5xl font-semibold text-accent">{s.n}</div>
            <div>
              <h2 className="font-display text-2xl font-semibold">{s.t}</h2>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <Button asChild size="lg"><Link to="/quiz">Começar meu quiz</Link></Button>
      </div>
    </div>
  );
}
