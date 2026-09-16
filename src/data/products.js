const bottle = (file) => new URL(`../../bottles/${file}`, import.meta.url).href

// NTS Blenders and Distillers portfolio content.
// Product imagery remains in the existing bottle slots until official NTS bottle
// assets are supplied; the names and copy below are based on publicly available
// NTS company/product information.
export const products = [
  {
    id: 'old-town',
    image: bottle('bottle-1.png'),
    name: 'Old Town Whiskey',
    series: 'NTS BLENDERS & DISTILLERS',
    category: 'WHISKEY',
    displayTitle: 'OLD TOWN',
    description: 'A smooth, timeless classic from the NTS portfolio, built around an approachable whiskey character.',
    detail: 'Old Town Whiskey is one of NTS Blenders and Distillers’ named brands, presented as a smooth, timeless classic.',
    style: 'Timeless classic',
    origin: 'NTS portfolio',
    tones: ['#100b08', '#3f2415', '#9a5d2d'],
    accent: '#e4b36b'
  },
  {
    id: 'east-coast-whisky',
    image: bottle('bottle-2.png'),
    name: 'East Coast Whisky',
    series: 'EAST COAST',
    category: 'WHISKY',
    displayTitle: 'EAST COAST',
    description: 'A rich, full-bodied whisky expression from NTS, part of its growing Indian-made spirits portfolio.',
    detail: 'East Coast is one of the NTS brands spanning whisky, rum and brandy, with a focus on rich, full-bodied blends.',
    style: 'Full-bodied blend',
    origin: 'NTS portfolio',
    tones: ['#0d0b08', '#402714', '#b26b2b'],
    accent: '#f0c47a'
  },
  {
    id: 'east-coast-rum',
    image: bottle('bottle-3.png'),
    name: 'East Coast Rum',
    series: 'EAST COAST',
    category: 'RUM',
    displayTitle: 'EAST COAST RUM',
    description: 'A rich and full-bodied rum expression from the East Coast range by NTS Blenders and Distillers.',
    detail: 'East Coast is part of NTS’s portfolio across whisky, rum and brandy, bringing the same full-bodied positioning to its rum expression.',
    style: 'Full-bodied blend',
    origin: 'NTS portfolio',
    tones: ['#120a07', '#4f1f10', '#a94a1f'],
    accent: '#f1a05b'
  },
  {
    id: 'zipper',
    image: bottle('bottle-4.png'),
    name: 'Zipper Vodka',
    series: 'NTS BLENDERS & DISTILLERS',
    category: 'VODKA',
    displayTitle: 'ZIPPER',
    description: 'A vodka range offered in plain and refreshing flavours including Green Apple, Orange, Lemon and Guava.',
    detail: 'Zipper Vodka is one of NTS’s named brands, with a plain expression alongside Green Apple, Orange, Lemon and Guava flavours.',
    style: 'Plain & flavoured',
    origin: 'NTS portfolio',
    tones: ['#071316', '#124b4c', '#67a9a0'],
    accent: '#9fe2d3'
  }
]
