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

export const products: Product[] = [
  { slug: "serum-niacinamida-acai", name: "Sérum Niacinamida 10% + Açaí", short: "Controla oleosidade e reduz poros.", description: "Sérum biotecnológico com 10% de niacinamida e extrato de açaí amazônico para uma pele equilibrada, com poros minimizados e luminosidade natural.", price: 89, badge: "Mais vendido", concerns: ["oleosidade", "acne"], skinTypes: ["oleosa", "mista"], line: "Tratamento", ingredients: "Aqua, Niacinamida, Euterpe Oleracea (Açaí) Extract, Glicerina, Pantenol.", howTo: "Aplique 3-4 gotas no rosto limpo, pela manhã e à noite, antes do hidratante.", rating: 4.8, reviews: 1284 },
  { slug: "gel-limpeza-copaiba", name: "Gel de Limpeza Copaíba", short: "Limpeza profunda e suave.", description: "Gel de limpeza com óleo de copaíba que remove impurezas sem ressecar a pele.", price: 49, concerns: ["oleosidade", "acne"], skinTypes: ["oleosa", "mista", "normal"], line: "Limpeza", ingredients: "Aqua, Copaifera Officinalis Resin, Coco-Glucoside, Glicerina.", howTo: "Massageie no rosto úmido pela manhã e à noite. Enxágue.", rating: 4.7, reviews: 932 },
  { slug: "hidratante-ah-biotecnologico", name: "Hidratante Ácido Hialurônico Biotec", short: "Hidratação intensa de longa duração.", description: "Hidratante leve com três pesos moleculares de ácido hialurônico biotecnológico.", price: 119, badge: "Mais vendido", concerns: ["ressecamento"], skinTypes: ["seca", "normal", "mista"], line: "Hidratação", ingredients: "Aqua, Sodium Hyaluronate (3 PM), Squalane, Pantenol.", howTo: "Aplique no rosto e pescoço limpos, manhã e noite.", rating: 4.9, reviews: 2104 },
  { slug: "protetor-solar-fps50", name: "Protetor Solar FPS 50 Invisible", short: "Toque seco, sem resíduo branco.", description: "Proteção solar de amplo espectro com textura invisível, ideal para uso diário.", price: 79, badge: "Mais vendido", concerns: ["manchas"], skinTypes: ["oleosa", "mista", "normal", "seca", "sensivel"], line: "Proteção", ingredients: "Filtros UVA/UVB, Niacinamida, Vitamina E.", howTo: "Aplique generosamente 15 min antes da exposição solar. Reaplique a cada 2h.", rating: 4.9, reviews: 3120 },
  { slug: "serum-vitamina-c-guarana", name: "Sérum Vitamina C + Guaraná", short: "Luminosidade e antioxidação.", description: "10% de vitamina C estabilizada com extrato de guaraná para uma pele radiante.", price: 99, badge: "Novo", concerns: ["manchas"], skinTypes: ["normal", "mista", "oleosa"], line: "Tratamento", ingredients: "Ascorbic Acid 10%, Paullinia Cupana, Ferulic Acid.", howTo: "Use pela manhã, antes do protetor solar.", rating: 4.7, reviews: 612 },
  { slug: "esfoliante-enzimatico-camomila", name: "Esfoliante Enzimático Camomila", short: "Renovação suave sem agredir.", description: "Esfoliante enzimático com extrato de camomila para uma renovação celular delicada.", price: 69, concerns: ["sensibilidade"], skinTypes: ["sensivel", "seca", "normal"], line: "Tratamento", ingredients: "Papain, Bromelain, Chamomile Extract.", howTo: "Use 2x por semana no rosto limpo. Enxágue após 5 min.", rating: 4.6, reviews: 421 },
  { slug: "creme-noturno-peptideos-acai", name: "Creme Noturno Peptídeos + Açaí", short: "Reparação noturna profunda.", description: "Creme de tratamento noturno com peptídeos biomiméticos e açaí.", price: 139, concerns: ["rugas"], skinTypes: ["seca", "normal", "mista"], line: "Hidratação", ingredients: "Matrixyl 3000, Açaí Oil, Squalane.", howTo: "Aplique à noite após o sérum.", rating: 4.8, reviews: 884 },
  { slug: "tonico-probiotico-equilibrante", name: "Tônico Probiótico Equilibrante", short: "Equilibra a microbiota cutânea.", description: "Tônico sem álcool com probióticos que fortalecem a barreira da pele.", price: 59, badge: "Novo", concerns: ["sensibilidade"], skinTypes: ["sensivel", "normal", "mista"], line: "Limpeza", ingredients: "Lactobacillus Ferment, Aloe, Niacinamida.", howTo: "Aplique com algodão após a limpeza.", rating: 4.5, reviews: 312 },
  { slug: "serum-retinol-encapsulado", name: "Sérum Retinol Encapsulado", short: "Anti-idade com liberação gradual.", description: "Retinol 0,3% encapsulado para máxima eficácia com mínima irritação.", price: 129, concerns: ["rugas", "manchas"], skinTypes: ["normal", "mista", "oleosa"], line: "Tratamento", ingredients: "Encapsulated Retinol 0.3%, Bisabolol, Squalane.", howTo: "Use à noite, 3x por semana inicialmente.", rating: 4.7, reviews: 765 },
  { slug: "mascara-argila-copaiba", name: "Máscara Argila + Copaíba", short: "Purifica e desintoxica.", description: "Máscara de argila verde com copaíba para limpeza profunda dos poros.", price: 65, concerns: ["oleosidade", "acne"], skinTypes: ["oleosa", "mista"], line: "Tratamento", ingredients: "Green Clay, Copaifera Officinalis, Tea Tree.", howTo: "Aplique 1-2x por semana por 10 min.", rating: 4.6, reviews: 398 },
  { slug: "locao-corporal-hidratante", name: "Loção Corporal Hidratante", short: "Hidratação corporal sedosa.", description: "Loção corporal de rápida absorção com manteiga de cupuaçu.", price: 79, concerns: ["ressecamento"], skinTypes: ["seca", "normal"], line: "Corpo", ingredients: "Cupuaçu Butter, Shea, Glicerina.", howTo: "Aplique no corpo após o banho.", rating: 4.7, reviews: 540 },
  { slug: "bruma-fixadora-aloe", name: "Bruma Fixadora Aloe Vera", short: "Refresca e fixa a maquiagem.", description: "Bruma refrescante com aloe vera para fixar a maquiagem e revigorar a pele.", price: 55, concerns: ["ressecamento"], skinTypes: ["seca", "normal", "mista", "oleosa", "sensivel"], line: "Hidratação", ingredients: "Aloe Barbadensis, Glicerina, Pantenol.", howTo: "Borrife a 20cm do rosto sempre que precisar.", rating: 4.5, reviews: 287 },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const kits = [
  {
    slug: "acne-control",
    name: "Kit Acne Control",
    price: 189,
    items: ["Gel de Limpeza Copaíba", "Sérum Niacinamida 10% + Açaí", "Hidratante Ácido Hialurônico Biotec", "Protetor Solar FPS 50 Invisible"],
    itemPrices: [49, 89, 119, 79],
    description: "Rotina completa para pele oleosa com tendência a acne.",
  },
  {
    slug: "glow-luminoso",
    name: "Kit Glow Luminoso",
    price: 219,
    items: ["Esfoliante Enzimático Camomila", "Sérum Vitamina C + Guaraná", "Hidratante Ácido Hialurônico Biotec", "Bruma Fixadora Aloe Vera"],
    itemPrices: [69, 99, 119, 55],
    description: "Para uma pele radiante e uniforme em poucos dias.",
  },
  {
    slug: "anti-manchas",
    name: "Kit Anti-Manchas",
    price: 199,
    items: ["Tônico Probiótico Equilibrante", "Sérum Retinol Encapsulado", "Creme Noturno Peptídeos + Açaí", "Protetor Solar FPS 50 Invisible"],
    itemPrices: [59, 129, 139, 79],
    description: "Combate manchas e uniformiza o tom da pele.",
  },
];
