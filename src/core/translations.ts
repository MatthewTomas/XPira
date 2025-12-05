// Translations for UI elements and game content

export interface LanguageTranslations {
  // Market stall labels
  fruits: string;
  vegetables: string;
  bakery: string;
  butcher: string;
  moreFruits: string;
  
  // Common phrases
  hello: string;
  welcome: string;
  whatWouldYouLike: string;
  thankYou: string;
  goodbye: string;
  iWant: string;
  please: string;
  
  // Food items
  apples: string;
  oranges: string;
  bananas: string;
  bread: string;
  meat: string;
  carrots: string;
}

export const translations: Record<string, LanguageTranslations> = {
  es: {
    fruits: 'Frutas 🍎',
    vegetables: 'Verduras 🥕',
    bakery: 'Panadería 🍞',
    butcher: 'Carnicería 🥩',
    moreFruits: 'Más Frutas 🍊',
    hello: '¡Hola!',
    welcome: 'Bienvenido',
    whatWouldYouLike: '¿Qué te gustaría comprar?',
    thankYou: 'Gracias',
    goodbye: '¡Adiós!',
    iWant: 'Quiero',
    please: 'Por favor',
    apples: 'manzanas',
    oranges: 'naranjas',
    bananas: 'plátanos',
    bread: 'pan',
    meat: 'carne',
    carrots: 'zanahorias',
  },
  fr: {
    fruits: 'Fruits 🍎',
    vegetables: 'Légumes 🥕',
    bakery: 'Boulangerie 🍞',
    butcher: 'Boucherie 🥩',
    moreFruits: 'Plus de Fruits 🍊',
    hello: 'Bonjour!',
    welcome: 'Bienvenue',
    whatWouldYouLike: 'Que voulez-vous acheter?',
    thankYou: 'Merci',
    goodbye: 'Au revoir!',
    iWant: 'Je veux',
    please: "S'il vous plaît",
    apples: 'pommes',
    oranges: 'oranges',
    bananas: 'bananes',
    bread: 'pain',
    meat: 'viande',
    carrots: 'carottes',
  },
  de: {
    fruits: 'Obst 🍎',
    vegetables: 'Gemüse 🥕',
    bakery: 'Bäckerei 🍞',
    butcher: 'Metzgerei 🥩',
    moreFruits: 'Mehr Obst 🍊',
    hello: 'Hallo!',
    welcome: 'Willkommen',
    whatWouldYouLike: 'Was möchten Sie kaufen?',
    thankYou: 'Danke',
    goodbye: 'Auf Wiedersehen!',
    iWant: 'Ich möchte',
    please: 'Bitte',
    apples: 'Äpfel',
    oranges: 'Orangen',
    bananas: 'Bananen',
    bread: 'Brot',
    meat: 'Fleisch',
    carrots: 'Karotten',
  },
  it: {
    fruits: 'Frutta 🍎',
    vegetables: 'Verdura 🥕',
    bakery: 'Panetteria 🍞',
    butcher: 'Macelleria 🥩',
    moreFruits: 'Altra Frutta 🍊',
    hello: 'Ciao!',
    welcome: 'Benvenuto',
    whatWouldYouLike: 'Cosa vorresti comprare?',
    thankYou: 'Grazie',
    goodbye: 'Arrivederci!',
    iWant: 'Voglio',
    please: 'Per favore',
    apples: 'mele',
    oranges: 'arance',
    bananas: 'banane',
    bread: 'pane',
    meat: 'carne',
    carrots: 'carote',
  },
  pt: {
    fruits: 'Frutas 🍎',
    vegetables: 'Legumes 🥕',
    bakery: 'Padaria 🍞',
    butcher: 'Açougue 🥩',
    moreFruits: 'Mais Frutas 🍊',
    hello: 'Olá!',
    welcome: 'Bem-vindo',
    whatWouldYouLike: 'O que você gostaria de comprar?',
    thankYou: 'Obrigado',
    goodbye: 'Tchau!',
    iWant: 'Eu quero',
    please: 'Por favor',
    apples: 'maçãs',
    oranges: 'laranjas',
    bananas: 'bananas',
    bread: 'pão',
    meat: 'carne',
    carrots: 'cenouras',
  },
  ja: {
    fruits: '果物 🍎',
    vegetables: '野菜 🥕',
    bakery: 'パン屋 🍞',
    butcher: '肉屋 🥩',
    moreFruits: 'もっと果物 🍊',
    hello: 'こんにちは！',
    welcome: 'ようこそ',
    whatWouldYouLike: '何を買いたいですか？',
    thankYou: 'ありがとう',
    goodbye: 'さようなら！',
    iWant: '欲しい',
    please: 'ください',
    apples: 'りんご',
    oranges: 'オレンジ',
    bananas: 'バナナ',
    bread: 'パン',
    meat: '肉',
    carrots: 'にんじん',
  },
};

export function getTranslation(langCode: string): LanguageTranslations {
  return translations[langCode] || translations['es'];
}
