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
    stockSelector: 'p.stock',
    urlBase: 'https://www.skyland.com.bd',
  },
  ultratech: {
    name: 'Ultratech',
    productSelector: '.product-thumb',
    nameSelector: '.caption h4 a',
    priceSelector: '.price-new, .price',
    stockSelector: '.stock-status',
    urlBase: 'https://www.ultratech.com.bd',
  },
};

export const CATEGORIES = {
  CPU: {
    displayName: 'CPU',
    // This category now uses the static DB, so URLs are for fallback/search
    urls: {
      techland: '/pc-components/processor',
      startech: '/component/processor',
      skyland: '/components/processor',
      ultratech: '/processor',
    },
  },
  Motherboard: {
    displayName: 'Motherboard',
    urls: {
      techland: '/pc-components/motherboard',
      startech: '/component/motherboard',
      skyland: '/components/motherboard',
      ultratech: '/motherboard',
    },
  },
  RAM: {
    displayName: 'Memory (RAM)',
    urls: {
      techland: '/pc-components/ram',
      startech: '/component/ram',
      skyland: '/components/ram-for-pc',
      ultratech: '/ram',
    },
  },
  GPU: {
    displayName: 'Graphics Card',
    urls: {
      techland: '/pc-components/graphics-card',
      startech: '/component/graphics-card',
      skyland: '/components/graphics-card',
      ultratech: '/graphics-card',
    },
  },
  Storage: {
    displayName: 'Storage',
    // BUG FIX: Ultratech has separate pages for SSD and HDD. We need to scrape both.
    // For simplicity in this example, we will point to a general page.
    // A more advanced scraper could handle multiple URLs per category.
    urls: {
      techland: '/pc-components/storage',
      startech: '/component/storage',
      skyland: '/components/storage',
      ultratech: '/ssd-drive', // Corrected to a valid page.
    },
  },
  PSU: {
    displayName: 'Power Supply',
    // BUG FIX: Corrected StarTech URL from 'power-supply-unit' to 'power-supply'
    urls: {
      techland: '/pc-components/power-supply',
      startech: '/component/power-supply',
      skyland: '/components/power-supply',
      ultratech: '/power-supply',
    },
  },
  Case: {
    displayName: 'Casing',
    urls: {
      techland: '/pc-components/casing',
      startech: '/component/casing',
      skyland: '/components/casing',
      ultratech: '/casing',
    },
  },
};
