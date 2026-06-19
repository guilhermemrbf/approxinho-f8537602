// Dados do cardápio Roxinho Açaíteria

export interface Size {
  id: string;
  name: string;
  ml: number;
  price: number;
  supremoPrice: number;
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
  recipe?: string[];
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
  { id: "240ml", name: "240ml", ml: 240, price: 15.0, supremoPrice: 17.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false },
  { id: "360ml", name: "360ml", ml: 360, price: 18.0, supremoPrice: 20.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false },
  { id: "480ml", name: "480ml", ml: 480, price: 22.0, supremoPrice: 24.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false },
];

export const flavors: Flavor[] = [
  {
    id: "tradicional",
    name: "Pote Tradicional",
    description: "Monte do seu jeito com 5 acompanhamentos básicos inclusos",
    icon: "🍇",
  },
  {
    id: "surpresinha-uva",
    name: "Surpresinha de Uva",
    description: "Creme de leitinho, leite em pó, leite condensado e uva",
    icon: "🍇",
    premium: true,
    recipe: ["Creme de leitinho", "Leite em pó", "Leite condensado", "Uva"],
  },
  {
    id: "casadinho",
    name: "Casadinho",
    description: "Creme de leitinho, creme de avelã + 1 fruta da sua preferência",
    icon: "💜",
    premium: true,
    recipe: ["Creme de leitinho", "Creme de avelã", "1 fruta à sua escolha"],
  },
  {
    id: "ferreiro",
    name: "Ferreiro",
    description: "Creme de avelã, amendoim granulado, paçoca + 1 fruta da sua preferência",
    icon: "🍫",
    premium: true,
    recipe: ["Creme de avelã", "Amendoim granulado", "Paçoca", "1 fruta à sua escolha"],
  },
];

export const complements: Complement[] = [
  { id: "leite-po", name: "Leite em Pó", price: 1.0, icon: "🥛" },
  { id: "leite-condensado", name: "Leite Condensado", price: 1.0, icon: "🥛" },
  { id: "disquete", name: "Disquete", price: 1.0, icon: "🍪" },
  { id: "amendoim-granulado", name: "Amendoim Granulado", price: 1.0, icon: "🥜" },
  { id: "pacoca", name: "Paçoca", price: 1.0, icon: "🥜" },
  { id: "flocos-crocantes", name: "Flocos Crocantes", price: 1.0, icon: "🥣" },
  { id: "gotas-chocolate", name: "Gotas de Chocolate", price: 1.0, icon: "🍫" },
  { id: "chocoball", name: "Chocoball", price: 1.0, icon: "🍫" },
  { id: "granola", name: "Granola", price: 1.0, icon: "🌾" },
  { id: "uva", name: "Uva", price: 1.0, icon: "🍇" },
  { id: "morango", name: "Morango", price: 1.0, icon: "🍓" },
  { id: "banana", name: "Banana", price: 1.0, icon: "🍌" },
  { id: "kiwi", name: "Kiwi", price: 1.0, icon: "🥝" },
];

export const toppings: Topping[] = [
  { id: "creme-leitinho", name: "Creme de Leitinho", price: 2.0, icon: "🥛" },
  { id: "creme-avela", name: "Creme de Avelã", price: 2.0, icon: "🍫" },
];

export const fruits: Fruit[] = [
  // Frutas agora estão incluídas nos complementos básicos.
];

export const creams: Cream[] = [
];

export const extras: Extra[] = [
];

export const businessInfo = {
  name: "Roxinho Açaíteria",
  tagline: "Seu momento açaí",
  address: "Uíbai - BA",
  phone: "(74) 99913-0885",
  whatsapp: "5574999130885",
  hours: "",
  deliveryFee: 0,
  instagram: "",
};
