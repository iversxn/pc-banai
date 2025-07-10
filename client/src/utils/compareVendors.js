export function getBestVendor(partName, vendorData) {
  let best = null;
  let lowestPrice = Infinity;

  for (const [vendor, parts] of Object.entries(vendorData)) {
    const match = parts.find((p) => p.name === partName);
    if (match && match.price < lowestPrice) {
      best = { ...match, vendor };
      lowestPrice = match.price;
    }
  }

  return best;
}
