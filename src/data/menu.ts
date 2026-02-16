// Dados do cardápio QUERO AÇAI 💜💚

export interface Size {
  id: string;
  name: string;
  ml: number;
  price: number;
  freeComplements: number;
  freeToppings: number;
  freeFruits: number;
  freeCream: boolean;
}

export interface Flavor {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Complement {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Fruit {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Cream {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export const sizes: Size[] = [
  { id: "200ml", name: "200ml", ml: 200, price: 11.99, freeComplements: 3, freeToppings: 1, freeFruits: 1, freeCream: false },
  { id: "300ml", name: "300ml", ml: 300, price: 13.99, freeComplements: 4, freeToppings: 1, freeFruits: 1, freeCream: false },
  { id: "400ml", name: "400ml", ml: 400, price: 16.99, freeComplements: 5, freeToppings: 1, freeFruits: 2, freeCream: false },
  { id: "500ml", name: "500ml", ml: 500, price: 18.99, freeComplements: 7, freeToppings: 1, freeFruits: 2, freeCream: false },
  { id: "700ml", name: "700ml", ml: 700, price: 26.99, freeComplements: 99, freeToppings: 99, freeFruits: 99, freeCream: false },
  { id: "1000ml", name: "1.000ml", ml: 1000, price: 38.99, freeComplements: 99, freeToppings: 99, freeFruits: 99, freeCream: true },
];

export const flavors: Flavor[] = [
  { id: "acai-tradicional", name: "Açaí Tradicional", description: "Açaí puro e cremoso", icon: "🍇" },
  { id: "acai-banana", name: "Açaí com Banana", description: "Nutritivo com banana", icon: "🍌" },
  { id: "acai-morango", name: "Açaí com Morango", description: "Frutado com morango", icon: "🍓" },
];

export const complements: Complement[] = [
  { id: "granola", name: "Granola", price: 1.0, icon: "🌾" },
  { id: "leite-po", name: "Leite em Pó", price: 1.0, icon: "🥛" },
  { id: "mm", name: "M&M", price: 1.0, icon: "🍬" },
  { id: "pacoca", name: "Paçoca", price: 1.0, icon: "🥜" },
  { id: "bala-goma", name: "Bala de Goma", price: 1.0, icon: "🍬" },
  { id: "coco-ralado", name: "Coco Ralado", price: 1.0, icon: "🥥" },
  { id: "flocos-arroz", name: "Flocos de Arroz", price: 1.0, icon: "🍚" },
  { id: "marshmallow", name: "Marshmallow", price: 1.0, icon: "☁️" },
  { id: "bolacha-negresco", name: "Bolacha Negresco", price: 1.0, icon: "🍪" },
  { id: "farinha-lactea", name: "Farinha Láctea", price: 1.0, icon: "🥛" },
  { id: "gotas-chocolate", name: "Gotas de Chocolate", price: 1.0, icon: "🍫" },
  { id: "sucrilhos", name: "Sucrilhos", price: 1.0, icon: "🥣" },
  { id: "amendoim-granulado", name: "Amendoim Granulado", price: 1.0, icon: "🥜" },
  { id: "ovomaltine", name: "Ovomaltine", price: 1.0, icon: "🍫" },
  { id: "granulado", name: "Granulado", price: 1.0, icon: "🍫" },
];

export const toppings: Topping[] = [
  { id: "leite-condensado", name: "Leite Condensado", price: 1.0, icon: "🥛" },
  { id: "calda-chocolate", name: "Calda de Chocolate", price: 1.0, icon: "🍫" },
  { id: "calda-morango", name: "Calda de Morango", price: 1.0, icon: "🍓" },
  { id: "calda-uva", name: "Calda de Uva", price: 1.0, icon: "🍇" },
  { id: "calda-caramelo", name: "Calda de Caramelo", price: 1.0, icon: "🍯" },
];

export const fruits: Fruit[] = [
  { id: "morango-fruta", name: "Morango", price: 1.0, icon: "🍓" },
  { id: "kiwi-fruta", name: "Kiwi", price: 1.0, icon: "🥝" },
  { id: "banana-fruta", name: "Banana", price: 1.0, icon: "🍌" },
  { id: "uva-fruta", name: "Uva s/ Semente", price: 1.0, icon: "🍇" },
];

export const creams: Cream[] = [
  { id: "creme-ninho", name: "Creme de Ninho", price: 2.0, icon: "🥛" },
  { id: "creme-morango", name: "Creme de Morango", price: 2.0, icon: "🍓" },
  { id: "mousse-maracuja", name: "Mousse de Maracujá", price: 2.0, icon: "🥭" },
  { id: "creme-nutella", name: "Creme de Nutella", price: 2.0, icon: "🍫" },
  { id: "creme-cookies", name: "Creme de Cookies", price: 2.0, icon: "🍪" },
  { id: "creme-chocolate", name: "Creme de Chocolate", price: 2.0, icon: "🍫" },
];

export const extras: Extra[] = [
  { id: "bis-chocolate", name: "Bis Chocolate", price: 0.99, icon: "🍫" },
  { id: "bis-branco", name: "Bis Branco", price: 0.99, icon: "🍪" },
  { id: "kit-kat", name: "Kit Kat", price: 0.99, icon: "🍫" },
  { id: "nutella", name: "Nutella (30g)", price: 3.0, icon: "🍫" },
  { id: "batom-garoto", name: "Batom Garoto", price: 1.99, icon: "🍬" },
  { id: "ouro-branco", name: "Ouro Branco", price: 1.49, icon: "🍬" },
  { id: "serenata", name: "Serenata", price: 1.49, icon: "🍬" },
];

export const businessInfo = {
  name: "QUERO AÇAI 💜💚",
  address: "Av. Duque de Caxias, 225",
  phone: "(74) 9 8144-8065",
  whatsapp: "5574981448065",
  hours: "Aberto todos os dias, 15h às 23h",
  deliveryFee: 5.0,
};
