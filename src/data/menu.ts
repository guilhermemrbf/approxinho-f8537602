// Dados do cardápio Açaí BH

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
  premium?: boolean;
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
  premium?: boolean;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export const sizes: Size[] = [
  { id: "150ml", name: "150ml", ml: 150, price: 9.99, freeComplements: 2, freeToppings: 1, freeFruits: 1, freeCream: false },
  { id: "200ml", name: "200ml", ml: 200, price: 11.99, freeComplements: 3, freeToppings: 1, freeFruits: 1, freeCream: false },
  { id: "300ml", name: "300ml", ml: 300, price: 13.99, freeComplements: 4, freeToppings: 1, freeFruits: 1, freeCream: false },
  { id: "400ml", name: "400ml", ml: 400, price: 16.99, freeComplements: 5, freeToppings: 1, freeFruits: 2, freeCream: false },
  { id: "500ml", name: "500ml", ml: 500, price: 18.99, freeComplements: 7, freeToppings: 1, freeFruits: 2, freeCream: false },
  { id: "700ml", name: "700ml", ml: 700, price: 26.99, freeComplements: 99, freeToppings: 99, freeFruits: 99, freeCream: false },
];

export const flavors: Flavor[] = [
  { id: "acai-tradicional", name: "Açaí Tradicional", description: "Açaí puro e cremoso", icon: "🍇" },
  { id: "acai-banana", name: "Açaí com Banana", description: "Nutritivo com banana", icon: "🍌" },
  { id: "acai-morango", name: "Açaí com Morango", description: "Frutado com morango", icon: "🍓" },
  { id: "acai-premium", name: "Açaí Premium", description: "Açaí premium especial (+R$1)", icon: "👑", premium: true },
  { id: "acai-zero", name: "Açaí Zero", description: "Sem açúcar (+R$1)", icon: "🥗", premium: true },
];

export const complements: Complement[] = [
  { id: "granola", name: "Granola", price: 1.0, icon: "🌾" },
  { id: "leite-po", name: "Leite em Pó", price: 1.0, icon: "🥛" },
  { id: "chocoball", name: "Chocoball", price: 1.0, icon: "🍫" },
  { id: "granulado", name: "Granulado", price: 1.0, icon: "🍫" },
  { id: "ovomaltine", name: "Ovomaltine", price: 1.0, icon: "🍫" },
  { id: "sucrilhos", name: "Sucrilhos", price: 1.0, icon: "🥣" },
  { id: "coco-ralado", name: "Coco Ralado", price: 1.0, icon: "🥥" },
  { id: "amendoim", name: "Amendoim", price: 1.0, icon: "🥜" },
  { id: "marshmallow", name: "Marshmallow", price: 1.0, icon: "☁️" },
  { id: "micangas", name: "Miçangas", price: 1.0, icon: "🍬" },
  { id: "confeitos-festa", name: "Confeitos Festa", price: 1.0, icon: "🎉" },
  { id: "pacoca", name: "Paçoca", price: 1.0, icon: "🥜" },
  { id: "flocos-arroz", name: "Flocos de Arroz", price: 1.0, icon: "🍚" },
  { id: "goma", name: "Goma", price: 1.0, icon: "🍬" },
  { id: "farinha-lactea", name: "Farinha Láctea", price: 1.0, icon: "🥛" },
  { id: "mm", name: "M&M", price: 1.0, icon: "🍬" },
  { id: "gotas-chocolate", name: "Gotas de Chocolate", price: 1.0, icon: "🍫" },
  { id: "flocos-chocolate", name: "Flocos de Chocolate", price: 1.0, icon: "🍫" },
  { id: "flocos-chocolate-branco", name: "Flocos de Chocolate Branco", price: 1.0, icon: "🤍" },
];

export const toppings: Topping[] = [
  { id: "leite-condensado", name: "Leite Condensado", price: 1.0, icon: "🥛" },
  { id: "calda-chocolate", name: "Calda de Chocolate", price: 1.0, icon: "🍫" },
  { id: "calda-morango", name: "Calda de Morango", price: 1.0, icon: "🍓" },
  { id: "calda-caramelo", name: "Calda de Caramelo", price: 1.0, icon: "🍯" },
];

export const fruits: Fruit[] = [
  { id: "morango-fruta", name: "Morango", price: 1.0, icon: "🍓" },
  { id: "banana-fruta", name: "Banana", price: 1.0, icon: "🍌" },
  { id: "kiwi-fruta", name: "Kiwi", price: 1.0, icon: "🥝" },
];

export const creams: Cream[] = [
  { id: "creme-cupuacu", name: "Creme de Cupuaçu", price: 2.0, icon: "🥭", premium: true },
  { id: "creme-maracuja", name: "Creme de Maracujá", price: 2.0, icon: "🥭" },
  { id: "creme-morango", name: "Creme de Morango", price: 2.0, icon: "🍓" },
  { id: "creme-nutella", name: "Creme de Nutella", price: 2.0, icon: "🍫", premium: true },
  { id: "creme-torta-limao", name: "Creme de Torta de Limão", price: 2.0, icon: "🍋", premium: true },
  { id: "creme-ninho", name: "Creme de Leite Ninho", price: 2.0, icon: "🥛" },
  { id: "creme-cookies", name: "Creme de Cookie", price: 2.0, icon: "🍪", premium: true },
];

export const extras: Extra[] = [
  { id: "batom-garoto", name: "Batom Garoto", price: 1.99, icon: "🍬" },
  { id: "serenata", name: "Serenata", price: 1.49, icon: "🍬" },
  { id: "kit-kat", name: "Kit Kat", price: 0.99, icon: "🍫" },
  { id: "nutella", name: "Nutella (30g)", price: 2.99, icon: "🍫" },
  { id: "bis", name: "Bis", price: 0.99, icon: "🍫" },
];

export const businessInfo = {
  name: "Açaí BH",
  address: "Praça Marinho de Carvalho, Uibaí-BA",
  phone: "(74) 98149-5762",
  whatsapp: "5574981495762",
  hours: "Aberto todos os dias, 15h às 23h",
  deliveryFee: 5.0,
  instagram: "@queroacai._",
};
