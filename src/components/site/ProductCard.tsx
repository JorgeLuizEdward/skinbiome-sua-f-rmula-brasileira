import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { featuredSerumSlug, gelPurificanteSlug, hydraBiotecSlug, solarVelvetSlug, radianceC10Slug, esfolianteRenewSlug } from "@/lib/products";
import { brl, useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import heroDropperUrl from "../../assets/hero-dropper-v2.png?url";
import gelPurificanteUrl from "../../assets/gel_purificante.png?url";
import hydraBiotecUrl from "../../assets/hydra_biotec2.png?url";
import solarVelvetUrl from "../../assets/solar_velvet2.png?url";
import radianceC10Url from "../../assets/radiance_c10_3.png?url";
import esfolianteRenewUrl from "../../assets/esfoliante_renew.png?url";

const productImageUrls: Record<string, string> = {
  [featuredSerumSlug]: heroDropperUrl,
  [gelPurificanteSlug]: gelPurificanteUrl,
  [hydraBiotecSlug]: hydraBiotecUrl,
  [solarVelvetSlug]: solarVelvetUrl,
  [radianceC10Slug]: radianceC10Url,
  [esfolianteRenewSlug]: esfolianteRenewUrl,
};

const productImageClass: Record<string, string> = {
  [featuredSerumSlug]: "h-full w-full scale-[1.12] object-contain",
  [gelPurificanteSlug]: "h-[90%] w-[90%] object-contain",
  [hydraBiotecSlug]: "h-[90%] w-[90%] object-contain",
  [solarVelvetSlug]: "h-[90%] w-[90%] object-contain",
  [radianceC10Slug]: "h-[90%] w-[90%] object-contain",
  [esfolianteRenewSlug]: "h-[90%] w-[90%] object-contain",
};

// Visual placeholder: soft gradient bubble representing the product
function Visual({ product }: { product: Product }) {
  const imageUrl = productImageUrls[product.slug];
  if (imageUrl) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-white">
        <img src={imageUrl} alt={product.name} className={productImageClass[product.slug]} />
      </div>
    );
  }

  // deterministic hue from slug
  const hash = [...product.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const tints = [
    "from-[oklch(0.94_0.03_150)] to-[oklch(0.86_0.05_150)]",
    "from-[oklch(0.95_0.025_75)] to-[oklch(0.88_0.04_75)]",
    "from-[oklch(0.93_0.04_100)] to-[oklch(0.85_0.06_140)]",
    "from-[oklch(0.94_0.02_60)] to-[oklch(0.87_0.05_80)]",
  ];
  const tint = tints[hash % tints.length];
  return (
    <div className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-gradient-to-br ${tint}`}>
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(60% 60% at 50% 40%, white, transparent)" }} />
      <div className="relative h-2/3 w-1/3 rounded-full bg-background/70 shadow-sm ring-1 ring-foreground/5" />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="group flex flex-col">
      <Link to="/loja/$slug" params={{ slug: product.slug }} className="relative block">
        <Visual product={product} />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <Link to="/loja/$slug" params={{ slug: product.slug }} className="text-sm font-medium text-foreground hover:underline">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.short}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{brl(product.price)}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              add({ slug: product.slug, name: product.name, price: product.price });
              toast.success("Adicionado ao carrinho");
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </Button>
        </div>
      </div>
    </article>
  );
}
