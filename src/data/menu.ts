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
  image?: string;
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

export const sizes: Size[] = [
  { id: "240ml", name: "240ml", ml: 240, price: 15.0, supremoPrice: 17.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false, image: "https://em-content.zobj.net/source/google/387/grapes_1f347.png" },
  { id: "360ml", name: "360ml", ml: 360, price: 18.0, supremoPrice: 20.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false, image: "https://em-content.zobj.net/source/google/387/grapes_1f347.png" },
  { id: "480ml", name: "480ml", ml: 480, price: 22.0, supremoPrice: 24.0, freeComplements: 5, freeToppings: 0, freeFruits: 0, freeCream: false, image: "https://em-content.zobj.net/source/google/387/grapes_1f347.png" },
];

export const flavors: Flavor[] = [
  {
    id: "tradicional",
    name: "Pote Tradicional",
    description: "Monte do seu jeito com 5 acompanhamentos básicos inclusos",
    icon: "🍇",
    image: "https://em-content.zobj.net/source/google/387/grapes_1f347.png",
  },
  {
    id: "surpresinha-uva",
    name: "Surpresinha de Uva",
    description: "Creme de leitinho, leite em pó, leite condensado e uva",
    icon: "🍇",
    premium: true,
    recipe: ["Creme de leitinho", "Leite em pó", "Leite condensado", "Uva"],
    image: "https://em-content.zobj.net/source/google/387/grapes_1f347.png",
  },
  {
    id: "casadinho",
    name: "Casadinho",
    description: "Creme de leitinho, creme de avelã + 1 fruta da sua preferência",
    icon: "💜",
    premium: true,
    recipe: ["Creme de leitinho", "Creme de avelã", "1 fruta à sua escolha"],
    image: "https://em-content.zobj.net/source/google/387/purple-heart_1f49c.png",
  },
  {
    id: "ferreiro",
    name: "Ferreiro",
    description: "Creme de avelã, amendoim granulado, paçoca + 1 fruta da sua preferência",
    icon: "🍫",
    premium: true,
    recipe: ["Creme de avelã", "Amendoim granulado", "Paçoca", "1 fruta à sua escolha"],
    image: "https://em-content.zobj.net/source/google/387/chocolate-bar_1f36b.png",
  },
];

export const complements: Complement[] = [
  { id: "leite-po", name: "Leite em Pó", price: 1.0, icon: "🥛", image: "https://em-content.zobj.net/source/google/387/glass-of-milk_1f95b.png" },
  { id: "leite-condensado", name: "Leite Condensado", price: 1.0, icon: "🥛", image: "https://em-content.zobj.net/source/google/387/pouring-liquid_1fad7.png" },
  { id: "disquete", name: "Disquete", price: 1.0, icon: "🍪", image: "https://em-content.zobj.net/source/google/387/cookie_1f36a.png" },
  { id: "amendoim-granulado", name: "Amendoim Granulado", price: 1.0, icon: "🥜", image: "https://em-content.zobj.net/source/google/387/peanuts_1f95c.png" },
  { id: "pacoca", name: "Paçoca", price: 1.0, icon: "🥜", image: "https://em-content.zobj.net/source/google/387/peanuts_1f95c.png" },
  { id: "flocos-crocantes", name: "Flocos Crocantes", price: 1.0, icon: "🥣", image: "https://em-content.zobj.net/source/google/387/bowl-with-spoon_1f963.png" },
  { id: "gotas-chocolate", name: "Gotas de Chocolate", price: 1.0, icon: "🍫", image: "https://em-content.zobj.net/source/google/387/chocolate-bar_1f36b.png" },
  { id: "chocoball", name: "Chocoball", price: 1.0, icon: "🍫", image: "https://em-content.zobj.net/source/google/387/chocolate-bar_1f36b.png" },
  { id: "granola", name: "Granola", price: 1.0, icon: "🌾", image: "https://em-content.zobj.net/source/google/387/sheaf-of-rice_1f33e.png" },
  { id: "uva", name: "Uva", price: 1.0, icon: "🍇", image: "https://em-content.zobj.net/source/google/387/grapes_1f347.png" },
  { id: "morango", name: "Morango", price: 1.0, icon: "🍓", image: "https://em-content.zobj.net/source/google/387/strawberry_1f353.png" },
  { id: "banana", name: "Banana", price: 1.0, icon: "🍌", image: "https://em-content.zobj.net/source/google/387/banana_1f34c.png" },
  { id: "kiwi", name: "Kiwi", price: 1.0, icon: "🥝", image: "https://em-content.zobj.net/source/google/387/kiwi-fruit_1f95d.png" },
];

export const toppings: Topping[] = [
  { id: "creme-leitinho", name: "Creme de Leitinho", price: 2.0, icon: "🥛", image: "https://em-content.zobj.net/source/google/387/glass-of-milk_1f95b.png" },
  { id: "creme-avela", name: "Creme de Avelã", price: 2.0, icon: "🍫", image: "https://em-content.zobj.net/source/google/387/chocolate-bar_1f36b.png" },
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
  whatsappLink: "https://api.whatsapp.com/message/JRWCKST6D3XWB1?autoload=1&app_absent=0&utm_source=ig",
  hours: "",
  deliveryFee: 5,
  instagram: "",
};
