// This file acts as a static database of known components and their compatibility specs.
// This allows for instant loading of product lists and intelligent filtering.

export const DB = {
  CPU: [
    // AMD AM5
    { name: 'AMD Ryzen 9 7950X', socket: 'AM5', memoryType: 'DDR5' },
    { name: 'AMD Ryzen 9 7900X', socket: 'AM5', memoryType: 'DDR5' },
    { name: 'AMD Ryzen 7 7700X', socket: 'AM5', memoryType: 'DDR5' },
    { name: 'AMD Ryzen 5 7600X', socket: 'AM5', memoryType: 'DDR5' },
    // AMD AM4
    { name: 'AMD Ryzen 9 5950X', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'AMD Ryzen 9 5900X', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'AMD Ryzen 7 5800X', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'AMD Ryzen 7 5700X', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'AMD Ryzen 5 5600X', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'AMD Ryzen 5 5600', socket: 'AM4', memoryType: 'DDR4' },
    // Intel LGA1700 (12th/13th/14th Gen)
    { name: 'Intel Core i9-14900K', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
    { name: 'Intel Core i7-14700K', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
    { name: 'Intel Core i5-14600K', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
    { name: 'Intel Core i9-13900K', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
    { name: 'Intel Core i7-13700K', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
    { name: 'Intel Core i5-13600K', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
    { name: 'Intel Core i5-12400F', socket: 'LGA1700', memoryType: ['DDR4', 'DDR5'] },
  ],
  Motherboard: [
    // AM5
    { name: 'ASUS ROG STRIX X670E-F GAMING WIFI', socket: 'AM5', memoryType: 'DDR5' },
    { name: 'Gigabyte B650 AORUS ELITE AX', socket: 'AM5', memoryType: 'DDR5' },
    { name: 'MSI MAG B650 TOMAHAWK WIFI', socket: 'AM5', memoryType: 'DDR5' },
    { name: 'ASRock B650M PG RIPTIDE', socket: 'AM5', memoryType: 'DDR5' },
    // AM4
    { name: 'ASUS ROG Strix B550-F Gaming', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'Gigabyte B550M DS3H', socket: 'AM4', memoryType: 'DDR4' },
    { name: 'MSI MAG B550 TOMAHAWK', socket: 'AM4', memoryType: 'DDR4' },
    // LGA1700 - DDR5
    { name: 'ASUS ROG STRIX Z790-E GAMING WIFI', socket: 'LGA1700', memoryType: 'DDR5' },
    { name: 'Gigabyte Z790 AORUS ELITE AX', socket: 'LGA1700', memoryType: 'DDR5' },
    { name: 'MSI MAG B760 TOMAHAWK WIFI', socket: 'LGA1700', memoryType: 'DDR5' },
    // LGA1700 - DDR4
    { name: 'ASUS TUF Gaming Z790-PLUS WIFI D4', socket: 'LGA1700', memoryType: 'DDR4' },
    { name: 'MSI PRO B760M-A WIFI DDR4', socket: 'LGA1700', memoryType: 'DDR4' },
    { name: 'ASRock Z690 Steel Legend WiFi 6E', socket: 'LGA1700', memoryType: 'DDR4' },
  ],
  RAM: [
    { name: 'Corsair Vengeance 16GB DDR5 5200MHz', type: 'DDR5' },
    { name: 'G.Skill Trident Z5 RGB 32GB DDR5 6000MHz', type: 'DDR5' },
    { name: 'Kingston Fury Beast 16GB DDR5 5600MHz', type: 'DDR5' },
    { name: 'Corsair Vengeance LPX 16GB DDR4 3200MHz', type: 'DDR4' },
    { name: 'G.Skill Ripjaws V 16GB DDR4 3600MHz', type: 'DDR4' },
    { name: 'Team T-Force Vulcan Z 16GB DDR4 3200MHz', type: 'DDR4' },
  ],
  // Other categories can be added here if they need pre-defined lists.
  // For now, GPU, Storage, etc., will be fetched live directly.
};
