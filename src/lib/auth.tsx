import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
};

type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

const SESSION_STORAGE_KEY = "skinbiome:auth";
const CUSTOMERS_STORAGE_KEY = "skinbiome:customers";
const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function readCustomers(): CustomerRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerRecord[]) : [];
  } catch {
    return [];
  }
}

function saveCustomers(customers: CustomerRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch {}
}

async function hashPassword(password: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return password;
}

function toAuthUser(customer: CustomerRecord): AuthUser {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(SESSION_STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {}
  }, [user, hydrated]);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      throw new Error("Preencha e-mail e senha.");
    }

    const customers = readCustomers();
    const customer = customers.find((item) => item.email === normalizeEmail(normalizedEmail));
    if (!customer) {
      throw new Error("Conta não encontrada. Faça seu cadastro.");
    }

    const passwordHash = await hashPassword(password);
    if (customer.passwordHash !== passwordHash) {
      throw new Error("Senha incorreta.");
    }

    customer.lastLoginAt = new Date().toISOString();
    customer.updatedAt = customer.lastLoginAt;
    saveCustomers(customers);
    setUser(toAuthUser(customer));
  };

  const register: AuthContextValue["register"] = async ({ name, email, phone, password }) => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    const trimmedPassword = password.trim();

    if (!trimmedName || !normalizedEmail || !normalizedPhone || !trimmedPassword) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }
    if (trimmedName.length < 3) {
      throw new Error("Nome completo deve ter ao menos 3 caracteres.");
    }
    if (!validEmail(normalizedEmail)) {
      throw new Error("E-mail inválido.");
    }
    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      throw new Error("Telefone inválido. Use DDD + número.");
    }
    if (!validPassword(trimmedPassword)) {
      throw new Error("Senha fraca. Use ao menos 8 caracteres, letras e números.");
    }

    const customers = readCustomers();
    const emailExists = customers.some((customer) => customer.email === normalizedEmail);
    if (emailExists) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const now = new Date().toISOString();
    const record: CustomerRecord = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      name: trimmedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash: await hashPassword(trimmedPassword),
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    saveCustomers([...customers, record]);
    setUser(toAuthUser(record));
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
