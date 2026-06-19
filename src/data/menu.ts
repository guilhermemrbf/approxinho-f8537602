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
  image?: string;
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
  image?: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  icon: string;
  image?: string;
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

export const ACAI_CUP_IMAGE =
  "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=120";

export const sizes: Size[] = [
  { id: "240ml", name: "240ml", ml: 240, price: 15.0, supremoPrice: 17.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false, image: ACAI_CUP_IMAGE },
  { id: "360ml", name: "360ml", ml: 360, price: 18.0, supremoPrice: 20.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false, image: ACAI_CUP_IMAGE },
  { id: "480ml", name: "480ml", ml: 480, price: 22.0, supremoPrice: 24.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false, image: ACAI_CUP_IMAGE },
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
  { id: "leite-po", name: "Leite em Pó", price: 1.0, icon: "🥛", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100" },
  { id: "leite-condensado", name: "Leite Condensado", price: 1.0, icon: "🥛", image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=100" },
  { id: "disquete", name: "Disquete", price: 1.0, icon: "🍪", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=100" },
  { id: "amendoim-granulado", name: "Amendoim Granulado", price: 1.0, icon: "🥜", image: "https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=100" },
  { id: "pacoca", name: "Paçoca", price: 1.0, icon: "🥜" },
  { id: "flocos-crocantes", name: "Flocos Crocantes", price: 1.0, icon: "🥣", image: "https://images.unsplash.com/photo-1531928351158-2f736078e0a1?w=100" },
  { id: "gotas-chocolate", name: "Gotas de Chocolate", price: 1.0, icon: "🍫", image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=100" },
  { id: "chocoball", name: "Chocoball", price: 1.0, icon: "🍫", image: "https://images.unsplash.com/photo-1548907040-4bea42859e6b?w=100" },
  { id: "granola", name: "Granola", price: 1.0, icon: "🌾", image: "https://images.unsplash.com/photo-1517093158544-7248a2257f3f?w=100" },
  { id: "uva", name: "Uva", price: 1.0, icon: "🍇", image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=100" },
  { id: "morango", name: "Morango", price: 1.0, icon: "🍓", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100" },
  { id: "banana", name: "Banana", price: 1.0, icon: "🍌", image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=100" },
  { id: "kiwi", name: "Kiwi", price: 1.0, icon: "🥝", image: "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=100" },
];

export const toppings: Topping[] = [
  { id: "creme-leitinho", name: "Creme de Leitinho", price: 2.0, icon: "🥛", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100" },
  { id: "creme-avela", name: "Creme de Avelã", price: 2.0, icon: "🍫", image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=100" },
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
