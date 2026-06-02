import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — Skinbiome" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setLoginPassword("");
      toast.success("Login realizado com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível entrar.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerPassword !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
      });
      setRegisterPassword("");
      setConfirmPassword("");
      toast.success("Cadastro realizado com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível finalizar o cadastro.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    const createdDate = new Date(user.createdAt).toLocaleDateString("pt-BR");
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-3xl font-semibold text-card-foreground">Minha conta</h1>
          <p className="mt-2 text-muted-foreground">Você está conectada(o) na Skinbiome.</p>

          <div className="mt-8 space-y-3 rounded-xl border border-border bg-background p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Nome</div>
              <div className="mt-1 text-sm font-medium text-foreground">{user.name}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">E-mail</div>
              <div className="mt-1 text-sm font-medium text-foreground">{user.email}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Telefone</div>
              <div className="mt-1 text-sm font-medium text-foreground">{user.phone}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Cliente desde</div>
              <div className="mt-1 text-sm font-medium text-foreground">{createdDate}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={logout} variant="outline">Sair da conta</Button>
            <Button asChild><Link to="/quiz">Fazer meu quiz</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-display text-3xl font-semibold text-card-foreground">
          {mode === "login" ? "Fazer login" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Entre para acompanhar seu perfil de pele e seus próximos pedidos."
            : "Cadastre-se para salvar seu perfil, acompanhar pedidos e receber recomendações personalizadas."}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-md px-3 py-2 text-sm transition ${
              mode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-md px-3 py-2 text-sm transition ${
              mode === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Cadastro
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={(e) => { void handleLogin(e); }} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="login-email">E-mail</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-1.5"
                placeholder="voce@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password">Senha</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="mt-1.5"
                placeholder="********"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        ) : (
          <form onSubmit={(e) => { void handleRegister(e); }} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="register-name">Nome completo</Label>
              <Input
                id="register-name"
                type="text"
                autoComplete="name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="mt-1.5"
                placeholder="Seu nome e sobrenome"
                required
              />
            </div>
            <div>
              <Label htmlFor="register-email">E-mail</Label>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="mt-1.5"
                placeholder="voce@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="register-phone">Telefone</Label>
              <Input
                id="register-phone"
                type="tel"
                autoComplete="tel"
                value={registerPhone}
                onChange={(e) => setRegisterPhone(formatPhone(e.target.value))}
                className="mt-1.5"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div>
              <Label htmlFor="register-password">Senha</Label>
              <Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="mt-1.5"
                placeholder="Mínimo 8 caracteres com letras e números"
                required
              />
            </div>
            <div>
              <Label htmlFor="register-password-confirm">Confirmar senha</Label>
              <Input
                id="register-password-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5"
                placeholder="Repita sua senha"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Seus dados ficam salvos no navegador para esta demonstração.
        </p>
      </div>
    </div>
  );
}
