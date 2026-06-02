import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
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
  phototype?: string;
  melasma?: string;
  morningSkin?: string;
  mainComplaint?: string;
  spf?: string;
  productReaction?: string;
  usuallyHas?: string;
  shineLevel?: string;
  skincareSteps?: string;
  skincareGoal?: string;
  name?: string;
  email?: string;
};

const steps = 13;
const faceFrameRatio = 0.7;
const phototypeOptions = [
  "I — muito clara",
  "II — clara",
  "III — média",
  "IV — morena",
  "V — marrom escura",
  "VI — marrom muito escura",
] as const;

async function detectPhototypeFromImage(file: File): Promise<string> {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Não foi possível processar a imagem.");
  }

  context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

  let totalLuminance = 0;
  let samples = 0;
  for (let y = 8; y < 56; y += 1) {
    for (let x = 8; x < 56; x += 1) {
      const index = (y * canvas.width + x) * 4;
      const r = data[index] / 255;
      const g = data[index + 1] / 255;
      const b = data[index + 2] / 255;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Ignora extremos de brilho que costumam ser fundo/estouro de luz/sombra profunda.
      if (luminance < 0.08 || luminance > 0.95) continue;

      totalLuminance += luminance;
      samples += 1;
    }
  }

  const avgLuminance = samples > 0 ? totalLuminance / samples : 0.62;

  if (avgLuminance > 0.8) return phototypeOptions[0];
  if (avgLuminance > 0.7) return phototypeOptions[1];
  if (avgLuminance > 0.6) return phototypeOptions[2];
  if (avgLuminance > 0.48) return phototypeOptions[3];
  if (avgLuminance > 0.36) return phototypeOptions[4];
  return phototypeOptions[5];
}

function QuizPage() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const photoPreviewRef = useRef<string | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const next = () => setStep((s) => Math.min(steps - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  useEffect(() => {
    return () => {
      if (photoPreviewRef.current) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isCameraOpen || !videoRef.current || !cameraStreamRef.current) return;
    videoRef.current.srcObject = cameraStreamRef.current;
    void videoRef.current.play().catch(() => {});
  }, [isCameraOpen]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setA((prev) => ({
      ...prev,
      name: prev.name?.trim() ? prev.name : user.name,
      email: prev.email?.trim() ? prev.email : user.email,
    }));
  }, [isAuthenticated, user]);

  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Seu navegador não suporta câmera em tempo real.");
      return;
    }

    stopCameraStream();
    setIsRequestingCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      cameraStreamRef.current = stream;
      setIsCameraOpen(true);
      toast.success("Câmera liberada. Faça a captura em tempo real.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        toast.error("Permissão de câmera negada. Autorize para continuar.");
      } else {
        toast.error("Não foi possível abrir a câmera.");
      }
    } finally {
      setIsRequestingCamera(false);
    }
  };

  const captureFromCamera = async () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 720;

    const frameSize = Math.floor(Math.min(width, height) * faceFrameRatio);
    const sourceX = Math.floor((width - frameSize) / 2);
    const sourceY = Math.floor((height - frameSize) / 2);

    const fullCanvas = captureCanvasRef.current ?? document.createElement("canvas");
    captureCanvasRef.current = fullCanvas;
    fullCanvas.width = frameSize;
    fullCanvas.height = frameSize;

    const context = fullCanvas.getContext("2d");
    if (!context) {
      toast.error("Não foi possível capturar a imagem.");
      return;
    }

    context.drawImage(
      video,
      sourceX,
      sourceY,
      frameSize,
      frameSize,
      0,
      0,
      frameSize,
      frameSize,
    );
    const blob = await new Promise<Blob | null>((resolve) => {
      fullCanvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      toast.error("Não foi possível gerar a foto capturada.");
      return;
    }

    const file = new File([blob], `captura-pele-${Date.now()}.jpg`, { type: "image/jpeg" });
    stopCameraStream();
    await handlePhotoSelection(file);
  };

  const handlePhotoSelection = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida.");
      return;
    }

    if (photoPreviewRef.current) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    photoPreviewRef.current = previewUrl;
    setPhotoPreview(previewUrl);
    setIsEditingPhoto(false);
    setIsAnalyzingPhoto(true);

    try {
      const detectedPhototype = await detectPhototypeFromImage(file);
      setA((prev) => ({ ...prev, phototype: detectedPhototype }));
      toast.success(`Fototipo detectado: ${detectedPhototype}`);
    } catch {
      toast.error("Não conseguimos analisar a foto. Tente novamente.");
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    stopCameraStream();
    if (photoPreviewRef.current) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }
    photoPreviewRef.current = null;
    setPhotoPreview(undefined);
    setIsEditingPhoto(false);
    setA((prev) => ({ ...prev, phototype: undefined }));
    toast.success("Foto removida.");
  };

  if (done) return <Result answers={a} />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-20">
      <Progress value={((step + 1) / steps) * 100} className="h-1" />
      <div className="mt-2 text-xs text-muted-foreground">Etapa {step + 1} de {steps}</div>

      <div key={step} className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {step === 0 && (
          <Question title="Envie uma foto para análise da pele" hint="Você pode enviar uma imagem ou abrir a câmera para captura.">
            <div className="space-y-4">
              {!photoPreview && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-border px-5 py-4 text-sm transition hover:border-foreground/30">
                    Enviar foto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        void handlePhotoSelection(e.target.files?.[0]);
                      }}
                    />
                  </label>
                  <Button type="button" variant="outline" onClick={() => { void openCamera(); }} disabled={isRequestingCamera}>
                    {isRequestingCamera ? "Solicitando permissão..." : "Abrir câmera"}
                  </Button>
                </div>
              )}

              {isCameraOpen && (
                <div className="space-y-3 rounded-2xl border border-border p-3">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="aspect-square w-full rounded-xl bg-black object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl">
                      <div
                        className="h-[70%] w-[70%] rounded-[999px] border-2 border-white/95 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Posicione o rosto dentro do oval e capture no estilo validação bancária.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={() => { void captureFromCamera(); }}>
                      Capturar foto
                    </Button>
                    <Button type="button" variant="ghost" onClick={stopCameraStream}>
                      Fechar câmera
                    </Button>
                  </div>
                </div>
              )}

              {photoPreview && (
                <div className="space-y-3">
                  <img
                    src={photoPreview}
                    alt="Prévia da foto de pele enviada pelo cliente"
                    className="aspect-square w-full rounded-2xl border border-border bg-muted/20 object-contain p-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingPhoto((prev) => !prev)}
                  >
                    Editar foto
                  </Button>

                  {isEditingPhoto && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="flex cursor-pointer items-center justify-center rounded-xl border border-border px-4 py-3 text-xs transition hover:border-foreground/30">
                        Substituir
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            void handlePhotoSelection(e.target.files?.[0]);
                          }}
                        />
                      </label>
                      <Button type="button" variant="outline" onClick={() => { void openCamera(); }} disabled={isRequestingCamera}>
                        {isRequestingCamera ? "Solicitando..." : "Nova captura"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={handleRemovePhoto}>
                        Excluir foto
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {isAnalyzingPhoto ? (
                <p className="text-sm text-muted-foreground">Analisando foto...</p>
              ) : (
                a.phototype && (
                  <p className="text-sm text-muted-foreground">
                    Fototipo sugerido pelo banco: <span className="font-medium text-foreground">{a.phototype}</span>. Você pode ajustar na próxima etapa.
                  </p>
                )
              )}

              <p className="text-xs text-muted-foreground">
                Dica: tire a foto com luz natural e sem filtro para melhorar a identificação.
              </p>
            </div>
          </Question>
        )}
        {step === 1 && (
          <Question title="Qual é o seu tipo de pele?">
            <Choices options={["seca", "oleosa", "mista", "normal", "sensível"]} value={a.skin} onChange={(v) => setA({ ...a, skin: v })} />
          </Question>
        )}
        {step === 2 && (
          <Question title="Qual é o seu fototipo (tonalidade de pele)?">
            <Choices
              options={[...phototypeOptions]}
              value={a.phototype}
              onChange={(v) => setA({ ...a, phototype: v })}
            />
          </Question>
        )}
        {step === 3 && (
          <Question title="Você possui melasma ou manchas escuras na pele?">
            <Choices
              options={["Sim", "Não", "Acho que sim, mas nunca confirmei", "Tenho outras manchas"]}
              value={a.melasma}
              onChange={(v) => setA({ ...a, melasma: v })}
            />
          </Question>
        )}
        {step === 4 && (
          <Question title="Como sua pele acorda pela manhã?">
            <Choices
              options={["Sequinha", "Oleosa", "Normal", "Oleosa só na zona T"]}
              value={a.morningSkin}
              onChange={(v) => setA({ ...a, morningSkin: v })}
            />
          </Question>
        )}
        {step === 5 && (
          <Question title="Qual sua maior queixa com a pele?">
            <Choices
              options={["Acne", "Oleosidade", "Manchas", "Ressecamento", "Sensibilidade"]}
              value={a.mainComplaint}
              onChange={(v) => setA({ ...a, mainComplaint: v })}
            />
          </Question>
        )}
        {step === 6 && (
          <Question title="Você usa protetor solar diariamente?">
            <Choices
              options={["Sim", "Às vezes", "Quase nunca", "Nunca"]}
              value={a.spf}
              onChange={(v) => setA({ ...a, spf: v })}
            />
          </Question>
        )}
        {step === 7 && (
          <Question title="Como sua pele reage a novos produtos?">
            <Choices
              options={["Super bem", "Às vezes irrita", "Fica vermelha fácil", "Depende do produto"]}
              value={a.productReaction}
              onChange={(v) => setA({ ...a, productReaction: v })}
            />
          </Question>
        )}
        {step === 8 && (
          <Question title="Você costuma ter:">
            <Choices
              options={["Cravos", "Espinhas inflamadas", "Manchas", "Nada disso"]}
              value={a.usuallyHas}
              onChange={(v) => setA({ ...a, usuallyHas: v })}
            />
          </Question>
        )}
        {step === 9 && (
          <Question title="Sua pele fica brilhando ao longo do dia?">
            <Choices
              options={["Muito", "Um pouco", "Quase nada", "Nunca"]}
              value={a.shineLevel}
              onChange={(v) => setA({ ...a, shineLevel: v })}
            />
          </Question>
        )}
        {step === 10 && (
          <Question title="Quantos passos tem seu skincare?">
            <Choices
              options={["Nenhum", "2 a 3", "4 a 6", "Sou a própria Sephora"]}
              value={a.skincareSteps}
              onChange={(v) => setA({ ...a, skincareSteps: v })}
            />
          </Question>
        )}
        {step === 11 && (
          <Question title="O que você procura em um skincare?">
            <Choices
              options={["Glow", "Controle da acne"]}
              value={a.skincareGoal}
              onChange={(v) => setA({ ...a, skincareGoal: v })}
            />
          </Question>
        )}
        {step === 12 && (
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
            (step === 1 && !a.skin) ||
            (step === 2 && !a.phototype) ||
            (step === 3 && !a.melasma) ||
            (step === 4 && !a.morningSkin) ||
            (step === 5 && !a.mainComplaint) ||
            (step === 6 && !a.spf) ||
            (step === 7 && !a.productReaction) ||
            (step === 8 && !a.usuallyHas) ||
            (step === 9 && !a.shineLevel) ||
            (step === 10 && !a.skincareSteps) ||
            (step === 11 && !a.skincareGoal)
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

function deriveConcernsFromAnswers(answers: Answers): string[] {
  const concerns = new Set<string>();

  const complaintMap: Record<string, string> = {
    Acne: "acne",
    Oleosidade: "oleosidade",
    Manchas: "manchas",
    Ressecamento: "ressecamento",
    Sensibilidade: "sensibilidade",
  };

  if (answers.mainComplaint && complaintMap[answers.mainComplaint]) {
    concerns.add(complaintMap[answers.mainComplaint]);
  }

  if (answers.melasma && answers.melasma !== "Não") {
    concerns.add("manchas");
  }

  if (answers.usuallyHas === "Manchas") concerns.add("manchas");
  if (answers.usuallyHas === "Cravos" || answers.usuallyHas === "Espinhas inflamadas") concerns.add("acne");

  if (answers.shineLevel === "Muito" || answers.shineLevel === "Um pouco") {
    concerns.add("oleosidade");
  }

  if (answers.morningSkin === "Sequinha") concerns.add("ressecamento");
  if (answers.morningSkin === "Oleosa" || answers.morningSkin === "Oleosa só na zona T") concerns.add("oleosidade");

  if (answers.productReaction === "Às vezes irrita" || answers.productReaction === "Fica vermelha fácil") {
    concerns.add("sensibilidade");
  }

  if (answers.skincareGoal === "Controle da acne") {
    concerns.add("acne");
  }

  if (answers.skincareGoal === "Glow") {
    concerns.add("manchas");
  }

  return Array.from(concerns);
}

function Result({ answers }: { answers: Answers }) {
  const { add } = useCart();
  const derivedConcerns = deriveConcernsFromAnswers(answers);

  const concernLabel: Record<string, string> = {
    acne: "acne",
    manchas: "manchas",
    rugas: "rugas",
    oleosidade: "oleosidade",
    ressecamento: "ressecamento",
    sensibilidade: "sensibilidade",
  };

  // Pick products matching skin + concerns
  const recs = products
    .filter((p) =>
      (!answers.skin || p.skinTypes.some((s) => answers.skin?.replace("â","a").includes(s)) || true) &&
      (derivedConcerns.length === 0 || p.concerns.some((c) => derivedConcerns.includes(c)))
    )
    .slice(0, 4);
  const morning = recs.slice(0, 2);
  const night = recs.slice(2, 4);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-20">
      <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-primary">Seu perfil</span>
      <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
        {answers.name?.split(" ")[0] ?? "Você"}, sua pele é <span className="text-primary">{answers.skin ?? "personalizada"}</span>
        {derivedConcerns.length > 0 && <> com tendência a {concernLabel[derivedConcerns[0]] ?? derivedConcerns[0]}</>}.
      </h1>
      {answers.phototype && (
        <p className="mt-3 text-sm text-muted-foreground">Fototipo informado: {answers.phototype}</p>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Hidratação", v: answers.skin === "seca" ? 35 : 60 },
          { l: "Uniformidade", v: derivedConcerns.includes("manchas") ? 40 : 65 },
          { l: "Proteção", v: answers.spf === "Sim" ? 80 : answers.spf === "Às vezes" ? 50 : answers.spf === "Quase nunca" ? 35 : 20 },
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
