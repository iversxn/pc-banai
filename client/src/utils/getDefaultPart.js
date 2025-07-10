import vendorData from '@data/retailers.json';

export function getDefaultPartForCategory(category) {
  const keywords = {
    CPU: ['Ryzen', 'Core i3', 'Core i5', 'Core i7', 'Processor'],
    Motherboard: ['Motherboard', 'B450', 'B550', 'Z690', 'AM4'],
    GPU: ['RTX', 'GTX', 'Radeon', 'Graphics Card'],
    RAM: ['DDR4', 'DDR5', 'Memory', 'RAM'],
    Storage: ['SSD', 'HDD', 'NVMe', 'M.2', 'Storage'],
    PSU: ['PSU', 'Power Supply', '650W', '550W'],
    Case: ['Casing', 'Case', 'NZXT', 'Cooler Master'],
    'CPU Cooler': ['Cooler', 'Fan', 'AIO'],
    'Case Fan': ['Fan', 'ARGB Fan', 'Case Fan'],
    Monitor: ['Monitor', 'Display', '144Hz', 'IPS'],
  };

  const matchWords = keywords[category] || [];

  for (const [vendor, parts] of Object.entries(vendorData)) {
    const match = parts.find((p) =>
      matchWords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase()))
    );
    if (match) return { ...match, vendor };
  }

  return null;
}
