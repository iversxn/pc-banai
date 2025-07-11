export const RETAILERS = {
  techland: {
    name: 'TechlandBD',
    productSelector: '.product-layout',
    nameSelector: '.name a',
    priceSelector: '.price-new, .price-normal, .price',
    stockSelector: '.stock span',
    urlBase: 'https://www.techlandbd.com',
  },
  startech: {
    name: 'StarTech',
    productSelector: '.p-item',
    nameSelector: '.p-item-name a',
    priceSelector: '.p-item-price span',
    stockSelector: '.p-stock',
    urlBase: 'https://www.startech.com.bd',
  },
  skyland: {
    name: 'Skyland',
    productSelector: '.product-thumb',
    nameSelector: '.caption h4 a',
    priceSelector: '.price .price-new, .price',
    stockSelector: 'p.stock', // Not always present
    urlBase: 'https://www.skyland.com.bd',
  },
  ultratech: {
    name: 'Ultratech',
    productSelector: '.product-thumb',
    nameSelector: '.caption h4 a',
    priceSelector: '.price-new, .price',
    stockSelector: '.stock-status', // Not always present
    urlBase: 'https://www.ultratech.com.bd',
  },
};

export const CATEGORIES = {
  CPU: {
    displayName: 'CPU',
    subCategories: ['AMD', 'Intel'],
    keywords: ['Ryzen', 'Core i', 'Athlon', 'Pentium', 'Celeron'],
    urls: {
      techland: '/pc-components/processor',
      startech: '/component/processor',
      skyland: '/components/processor',
      ultratech: '/processor',
    },
  },
  Motherboard: {
    displayName: 'Motherboard',
    subCategories: ['AMD', 'Intel'],
    keywords: ['Motherboard', 'B550', 'B650', 'Z790', 'A620'],
    urls: {
      techland: '/pc-components/motherboard',
      startech: '/component/motherboard',
      skyland: '/components/motherboard',
      ultratech: '/motherboard',
    },
  },
  GPU: {
    displayName: 'Graphics Card',
    subCategories: ['NVIDIA', 'AMD', 'Intel'],
    keywords: ['RTX', 'GTX', 'Radeon', 'Arc', 'Graphics Card'],
    urls: {
      techland: '/pc-components/graphics-card',
      startech: '/component/graphics-card',
      skyland: '/components/graphics-card',
      ultratech: '/graphics-card',
    },
  },
  RAM: {
    displayName: 'Memory (RAM)',
    subCategories: ['DDR5', 'DDR4'],
    keywords: ['DDR4', 'DDR5', 'RAM', 'Memory'],
    urls: {
      techland: '/pc-components/ram',
      startech: '/component/ram',
      skyland: '/components/ram-for-pc',
      ultratech: '/ram',
    },
  },
  Storage: {
    displayName: 'Storage',
    subCategories: ['SSD', 'HDD', 'NVMe'],
    keywords: ['SSD', 'HDD', 'NVMe', 'Hard Drive', 'M.2'],
    urls: {
      techland: '/pc-components/storage',
      startech: '/component/storage',
      skyland: '/components/storage',
      ultratech: '/ssd-drive', // Note: Ultratech has separate pages
    },
  },
  PSU: {
    displayName: 'Power Supply',
    subCategories: [],
    keywords: ['PSU', 'Power Supply'],
    urls: {
      techland: '/pc-components/power-supply',
      startech: '/component/power-supply-unit',
      skyland: '/components/power-supply',
      ultratech: '/power-supply',
    },
  },
  Case: {
    displayName: 'Casing',
    subCategories: [],
    keywords: ['Case', 'Casing'],
    urls: {
      techland: '/pc-components/casing',
      startech: '/component/casing',
      skyland: '/components/casing',
      ultratech: '/casing',
    },
  },
};
