// Dados do cardápio Q!delícia - Açaí e Cupuaçu

export interface Size {
  id: string;
  name: string;
  ml: number;
  price: number;
  freeComplements: number;
  freeToppings: number;
  freeFruits: number;
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

export const sizes: Size[] = [
  { id: "300ml", name: "Pequeno", ml: 300, price: 16.0, freeComplements: 3, freeToppings: 1, freeFruits: 1 },
  { id: "500ml", name: "Médio", ml: 500, price: 24.0, freeComplements: 3, freeToppings: 1, freeFruits: 1 },
  { id: "700ml", name: "Grande", ml: 700, price: 32.0, freeComplements: 3, freeToppings: 1, freeFruits: 1 },
];

export const flavors: Flavor[] = [
  { id: "acai-leitinho", name: "Açaí c/ Leitinho", description: "Cremoso com leite condensado", icon: "🍇" },
  { id: "acai-guarana", name: "Açaí + Guaraná", description: "Refrescante com guaraná", icon: "🍇" },
  { id: "acai-banana", name: "Açaí + Banana", description: "Nutritivo com banana", icon: "🍌" },
  { id: "acai-morango", name: "Açaí + Morango", description: "Frutado com morango", icon: "🍓" },
  { id: "acai-cupuacu", name: "Açaí + Cupuaçu", description: "Mix amazônico especial", icon: "🥭" },
  { id: "creme-cupuacu", name: "Creme de Cupuaçu", description: "100% cupuaçu cremoso", icon: "🥭" },
];

export const complements: Complement[] = [
  { id: "confeti", name: "Confeti", price: 2.0, icon: "🎊" },
  { id: "granulado", name: "Granulado", price: 2.0, icon: "🍫" },
  { id: "coco-flocos", name: "Coco em Flocos", price: 2.0, icon: "🥥" },
  { id: "choco-power", name: "Choco Power", price: 2.0, icon: "⚡" },
  { id: "pacoca", name: "Paçoca", price: 2.0, icon: "🥜" },
  { id: "leite-po", name: "Leite em Pó", price: 2.0, icon: "🥛" },
  { id: "granola", name: "Granola", price: 2.0, icon: "🌾" },
  { id: "jujuba", name: "Jujuba", price: 2.0, icon: "🍬" },
  { id: "sucrilhos", name: "Sucrilhos", price: 2.0, icon: "🥣" },
  { id: "amendoim", name: "Amendoim", price: 2.0, icon: "🥜" },
  { id: "bis-preto", name: "Bis Preto", price: 3.0, icon: "🍫" },
  { id: "bis-branco", name: "Bis Branco", price: 3.0, icon: "🍪" },
  { id: "bombom", name: "Bombom", price: 3.0, icon: "🍬" },
  { id: "marshmallow", name: "Marshmallow", price: 2.0, icon: "☁️" },
  { id: "gotas-chocolate", name: "Gotas de Chocolate", price: 2.0, icon: "🍫" },
  { id: "cookies", name: "Cookies Granulados", price: 2.0, icon: "🍪" },
];

export const toppings: Topping[] = [
  { id: "morango", name: "Morango", price: 2.0, icon: "🍓" },
  { id: "cereja", name: "Cereja", price: 2.0, icon: "🍒" },
  { id: "caramelo", name: "Caramelo", price: 2.0, icon: "🍯" },
  { id: "chocolate", name: "Chocolate", price: 2.0, icon: "🍫" },
  { id: "chocolate-branco", name: "Chocolate Branco", price: 2.0, icon: "🤍" },
  { id: "limao", name: "Limão", price: 2.0, icon: "🍋" },
  { id: "mel", name: "Mel", price: 2.0, icon: "🍯" },
  { id: "chocolate-confeiteiro", name: "Chocolate Confeiteiro", price: 2.0, icon: "🍫" },
  { id: "leite-condensado", name: "Leite Condensado", price: 2.0, icon: "🥛" },
  { id: "sabor-coco", name: "Sabor Coco", price: 2.0, icon: "🥥" },
  { id: "porto-blue", name: "Porto Blue", price: 2.0, icon: "💙" },
  { id: "uva", name: "Uva", price: 2.0, icon: "🍇" },
  { id: "milho-verde", name: "Milho Verde", price: 2.0, icon: "🌽" },
  { id: "goiaba", name: "Goiaba", price: 2.0, icon: "🍑" },
  { id: "amendoim-cobertura", name: "Amendoim", price: 2.0, icon: "🥜" },
  { id: "acai-cobertura", name: "Açaí", price: 2.0, icon: "🍇" },
  { id: "kiwi-cobertura", name: "Kiwi", price: 2.0, icon: "🥝" },
  { id: "menta", name: "Menta", price: 2.0, icon: "🌿" },
  { id: "graviola", name: "Graviola", price: 2.0, icon: "🥭" },
];

export const fruits: Fruit[] = [
  { id: "morango-fruta", name: "Morango", price: 3.0, icon: "🍓" },
  { id: "kiwi-fruta", name: "Kiwi", price: 3.0, icon: "🥝" },
  { id: "abacaxi-fruta", name: "Abacaxi", price: 3.0, icon: "🍍" },
  { id: "banana-fruta", name: "Banana", price: 3.0, icon: "🍌" },
];

export const businessInfo = {
  name: "Q!delícia Pizzaria & Esfiharia",
  address: "Rua São José, nº 198",
  phone: "(74) 98117-8184",
  whatsapp: "5574981178184",
  hours: "Quarta a Segunda, 15h às 23h",
  deliveryFee: 5.0,
};
