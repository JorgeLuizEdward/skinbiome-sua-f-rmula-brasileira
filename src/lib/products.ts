export type Product = {
  slug: string;
  name: string;
  short: string;
  description: string;
  price: number;
  badge?: "Mais vendido" | "Novo";
  concerns: string[]; // acne, manchas, rugas, oleosidade, ressecamento, sensibilidade
  skinTypes: string[]; // seca, oleosa, mista, normal, sensivel
  line: string; // Limpeza, Tratamento, Hidratação, Proteção, Corpo
  ingredients: string;
  howTo: string;
  rating: number;
  reviews: number;
};

export const featuredSerumSlug = "serum-niacinamida-acai";
export const gelPurificanteSlug = "gel-limpeza-copaiba";
export const hydraBiotecSlug = "hidratante-ah-biotecnologico";
export const solarVelvetSlug = "protetor-solar-fps50";
export const radianceC10Slug = "serum-vitamina-c-guarana";
export const esfolianteRenewSlug = "esfoliante-enzimatico-camomila";

export const products: Product[] = [
  { slug: "serum-niacinamida-acai", name: "Sérum Rejuvekhedor Supreme", short: "Controla oleosidade e reduz poros.", description: "Sérum biotecnológico com 10% de niacinamida e extrato botânico para uma pele equilibrada, com poros minimizados e luminosidade natural.", price: 89, badge: "Mais vendido", concerns: ["oleosidade", "acne"], skinTypes: ["oleosa", "mista"], line: "Tratamento", ingredients: "Aqua, Niacinamida, Euterpe Oleracea (Açaí) Extract, Glicerina, Pantenol.", howTo: "Aplique 3-4 gotas no rosto limpo, pela manhã e à noite, antes do hidratante.", rating: 4.8, reviews: 1284 },
  { slug: "gel-limpeza-copaiba", name: "Gel Purificante Balance", short: "Limpeza profunda e suave.", description: "Gel de limpeza com ativo purificante que remove impurezas sem ressecar a pele.", price: 49, concerns: ["oleosidade", "acne"], skinTypes: ["oleosa", "mista", "normal"], line: "Limpeza", ingredients: "Aqua, Copaifera Officinalis Resin, Coco-Glucoside, Glicerina.", howTo: "Massageie no rosto úmido pela manhã e à noite. Enxágue.", rating: 4.7, reviews: 932 },
  { slug: "hidratante-ah-biotecnologico", name: "Hydra Luxe Biotec", short: "Hidratação intensa de longa duração.", description: "Hidratante leve com três pesos moleculares de ácido hialurônico biotecnológico.", price: 119, badge: "Mais vendido", concerns: ["ressecamento"], skinTypes: ["seca", "normal", "mista"], line: "Hidratação", ingredients: "Aqua, Sodium Hyaluronate (3 PM), Squalane, Pantenol.", howTo: "Aplique no rosto e pescoço limpos, manhã e noite.", rating: 4.9, reviews: 2104 },
  { slug: "protetor-solar-fps50", name: "Solar Velvet FPS 50", short: "Toque seco, sem resíduo branco.", description: "Proteção solar de amplo espectro com textura invisível, ideal para uso diário.", price: 79, badge: "Mais vendido", concerns: ["manchas"], skinTypes: ["oleosa", "mista", "normal", "seca", "sensivel"], line: "Proteção", ingredients: "Filtros UVA/UVB, Niacinamida, Vitamina E.", howTo: "Aplique generosamente 15 min antes da exposição solar. Reaplique a cada 2h.", rating: 4.9, reviews: 3120 },
  { slug: "serum-vitamina-c-guarana", name: "Radiance C10 Elixir", short: "Luminosidade e antioxidação.", description: "10% de vitamina C estabilizada para uma pele radiante.", price: 99, badge: "Novo", concerns: ["manchas"], skinTypes: ["normal", "mista", "oleosa"], line: "Tratamento", ingredients: "Ascorbic Acid 10%, Paullinia Cupana, Ferulic Acid.", howTo: "Use pela manhã, antes do protetor solar.", rating: 4.7, reviews: 612 },
  { slug: "esfoliante-enzimatico-camomila", name: "Renew Enzyme Polish", short: "Renovação suave sem agredir.", description: "Esfoliante enzimático para uma renovação celular delicada.", price: 69, concerns: ["sensibilidade"], skinTypes: ["sensivel", "seca", "normal"], line: "Tratamento", ingredients: "Papain, Bromelain, Chamomile Extract.", howTo: "Use 2x por semana no rosto limpo. Enxágue após 5 min.", rating: 4.6, reviews: 421 },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const kits = [
  {
    slug: "acne-control",
    name: "Kit Acne Control",
    price: 189,
    items: ["Gel Purificante Balance", "Sérum Rejuvekhedor Supreme", "Hydra Luxe Biotec", "Solar Velvet FPS 50"],
    itemPrices: [49, 89, 119, 79],
    description: "Rotina completa para pele oleosa com tendência a acne.",
  },
  {
    slug: "glow-luminoso",
    name: "Kit Glow Luminoso",
    price: 219,
    items: ["Renew Enzyme Polish", "Radiance C10 Elixir", "Hydra Luxe Biotec", "Solar Velvet FPS 50"],
    itemPrices: [69, 99, 119, 79],
    description: "Para uma pele radiante e uniforme em poucos dias.",
  },
  {
    slug: "anti-manchas",
    name: "Kit Anti-Manchas",
    price: 199,
    items: ["Radiance C10 Elixir", "Sérum Rejuvekhedor Supreme", "Hydra Luxe Biotec", "Solar Velvet FPS 50"],
    itemPrices: [99, 89, 119, 79],
    description: "Combate manchas e uniformiza o tom da pele.",
  },
];
