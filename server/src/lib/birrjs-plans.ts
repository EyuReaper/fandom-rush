
export const PLANS = {
  enthusiast: {
    birrjsPriceId: 'price_enthusiast',
    price: 99,
    currency: 'ETB',
    name: 'Enthusiast Pack',
    description: '36 premium clues across Mythology, Internet culture & sports',
  },
  fanatic: {
    birrjsPriceId: 'price_fanatic',
    price: 249,
    currency: 'ETB',
    name: 'Fanatic Pack',
    description: 'Everything in Ethusiast + 60 more clues + Survival Mode + cosmetics',
  },
} as const;

export type PackId = keyof typeof PLANS;
