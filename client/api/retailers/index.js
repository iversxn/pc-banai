import axios from 'axios';
import * as cheerio from 'cheerio';
import { RETAILERS, CATEGORIES } from '../../src/data/componentConfig.js';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
};

// Reusable scraping function for a single retailer and category
async function scrapeRetailerCategory(retailerKey, categoryKey) {
  const retailer = RETAILERS[retailerKey];
  const category = CATEGORIES[categoryKey];
  const urlPath = category.urls[retailerKey];

  if (!urlPath) return [];

  const url = `${retailer.urlBase}${urlPath}`;
  const products = [];

  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 }); // 15s timeout
    const $ = cheerio.load(data);

    $(retailer.productSelector).each((_, el) => {
      const name = $(el).find(retailer.nameSelector).text().trim();
      let priceText = $(el).find(retailer.priceSelector).first().text().trim();
      let stockText = $(el).find(retailer.stockSelector).text().trim() || 'In Stock';
      let productUrl = $(el).find(retailer.nameSelector).attr('href');

      if (name && productUrl) {
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
        
        if (price === 0) return; // Skip items with no price

        if (!productUrl.startsWith('http')) {
          productUrl = new URL(productUrl, retailer.urlBase).href;
        }

        const stock = /out of stock/i.test(stockText) ? 'Out of Stock' : 'In Stock';

        products.push({
          name,
          price,
          stock,
          url: productUrl,
          vendor: retailer.name,
          category: categoryKey,
        });
      }
    });
  } catch (err) {
    // Don't throw an error for a single failed retailer, just log it
    console.error(`[API] Error scraping ${url}: ${err.message}`);
  }
  return products;
}

// The main API handler
export default async function handler(req, res) {
  const { category: categoryKey } = req.query;

  if (!categoryKey || !CATEGORIES[categoryKey]) {
    return res.status(400).json({ success: false, error: 'A valid category must be provided.' });
  }

  try {
    console.log(`[API] Starting on-demand scrape for category: ${categoryKey}`);
    
    const scrapingPromises = Object.keys(RETAILERS).map(retailerKey =>
      scrapeRetailerCategory(retailerKey, categoryKey)
    );

    const results = await Promise.all(scrapingPromises);
    const allProducts = results.flat();

    console.log(`[API] Found ${allProducts.length} total products for ${categoryKey}.`);

    // Set cache headers to allow caching on the browser and Vercel's edge network for a short time
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600'); // 5 min cache

    return res.status(200).json({
      success: true,
      data: allProducts,
    });

  } catch (err) {
    console.error(`[API] Fatal error in handler for category ${categoryKey}:`, err);
    return res.status(500).json({ success: false, error: 'Failed to scrape data.' });
  }
}
