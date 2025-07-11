import axios from 'axios';
import * as cheerio from 'cheerio';
import { RETAILERS, CATEGORIES } from '../../src/data/componentConfig.js';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
};

// This function now searches for a specific product name on a retailer's category page.
async function searchRetailerForProduct(retailerKey, categoryKey, productName) {
  const retailer = RETAILERS[retailerKey];
  const category = CATEGORIES[categoryKey];
  const urlPath = category.urls[retailerKey];

  if (!urlPath) return [];

  // A more advanced implementation would use the retailer's search functionality.
  // For now, we scrape the category page and filter by name.
  const url = `${retailer.urlBase}${urlPath}`;
  const foundOffers = [];
  
  // Create keywords from the product name to find matches
  const keywords = productName.toLowerCase().split(' ').filter(k => k.length > 2);

  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);

    $(retailer.productSelector).each((_, el) => {
      const name = $(el).find(retailer.nameSelector).text().trim();
      const nameLower = name.toLowerCase();
      
      // Check if the scraped name contains all keywords of our target product
      const isMatch = keywords.every(kw => nameLower.includes(kw));

      if (isMatch) {
        let priceText = $(el).find(retailer.priceSelector).first().text().trim();
        let stockText = $(el).find(retailer.stockSelector).text().trim() || 'In Stock';
        let productUrl = $(el).find(retailer.nameSelector).attr('href');
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

        if (price > 0 && productUrl) {
          if (!productUrl.startsWith('http')) {
            productUrl = new URL(productUrl, retailer.urlBase).href;
          }
          const stock = /out of stock/i.test(stockText) ? 'Out of Stock' : 'In Stock';
          foundOffers.push({ name, price, stock, url: productUrl, vendor: retailer.name, category: categoryKey });
        }
      }
    });
  } catch (err) {
    console.error(`[API Search] Error scraping ${url}: ${err.message}`);
  }
  return foundOffers;
}

// Main API handler for fetching live offers for a specific product
export default async function handler(req, res) {
  const { category, productName } = req.query;

  if (!category || !productName || !CATEGORIES[category]) {
    return res.status(400).json({ success: false, error: 'Category and productName are required.' });
  }

  try {
    console.log(`[API] Fetching offers for "${productName}" in category "${category}"`);
    
    const searchPromises = Object.keys(RETAILERS).map(retailerKey =>
      searchRetailerForProduct(retailerKey, category, productName)
    );

    const results = await Promise.all(searchPromises);
    const allOffers = results.flat();

    console.log(`[API] Found ${allOffers.length} live offers for "${productName}".`);

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    return res.status(200).json({ success: true, data: allOffers });

  } catch (err) {
    console.error(`[API] Fatal error for product ${productName}:`, err);
    return res.status(500).json({ success: false, error: 'Failed to fetch live offers.' });
  }
}
