import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — Skinbiome" }] }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Minha conta</h1>
      <p className="mt-3 text-muted-foreground">A área de conta — pedidos, perfil de pele e assinaturas — chega na próxima atualização.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild><Link to="/quiz">Fazer meu quiz</Link></Button>
        <Button asChild variant="outline"><Link to="/loja">Voltar à loja</Link></Button>
      </div>
    </div>
  );
}
