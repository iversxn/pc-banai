export const RETAILERS = {
  techland: { name: 'TechlandBD', urlBase: 'https://www.techlandbd.com' },
  startech: { name: 'StarTech', urlBase: 'https://www.startech.com.bd' },
  skyland: { name: 'Skyland', urlBase: 'https://www.skyland.com.bd' },
  ultratech: { name: 'Ultratech', urlBase: 'https://www.ultratech.com.bd' },
};

export const CATEGORIES = {
  CPU: {
    displayName: 'CPU',
    urls: {
      techland: '/pc-components/processor',
      startech: '/component/processor',
      skyland: '/components/processor',
      ultratech: '/processor',
    },
    // New guided flow configuration
    brands: {
      AMD: {
        series: [
          { name: 'Ryzen 7000 Series (AM5)', socket: 'AM5', memoryType: 'DDR5', keywords: ['7950x', '7900x', '7700x', '7600x', '7500f'] },
          { name: 'Ryzen 5000 Series (AM4)', socket: 'AM4', memoryType: 'DDR4', keywords: ['5950x', '5900x', '5800x', '5700x', '5600x', '5600', '5500'] },
        ]
      },
      Intel: {
        series: [
          { name: '14th Gen Core Series (LGA1700)', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'], keywords: ['14900', '14700', '14600', '14400'] },
          { name: '13th Gen Core Series (LGA1700)', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'], keywords: ['13900', '13700', '13600', '13400', '13100'] },
          { name: '12th Gen Core Series (LGA1700)', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'], keywords: ['12900', '12700', '12600', '12400', '12100'] },
        ]
      }
    }
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
    urls: {
      techland: '/pc-components/storage',
      startech: '/component/storage',
      skyland: '/components/storage',
      ultratech: '/ssd-drive',
    },
  },
  PSU: {
    displayName: 'Power Supply',
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
