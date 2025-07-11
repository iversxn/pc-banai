import axios from 'axios';
import * as cheerio from 'cheerio';
import { RETAILERS, CATEGORIES } from '../../src/data/componentConfig.js';
import { setCache, setUpdating } from '../utils/cache.js';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
};

// Generic scraper function
async function scrapeRetailerCategory(retailerKey, categoryKey) {
  const retailer = RETAILERS[retailerKey];
  const category = CATEGORIES[categoryKey];
  const urlPath = category.urls[retailerKey];

  if (!urlPath) return [];

  const url = `${retailer.urlBase}${urlPath}`;
  const products = [];

  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 });
    const $ = cheerio.load(data);

    $(retailer.productSelector).each((_, el) => {
      const name = $(el).find(retailer.nameSelector).text().trim();
      let priceText = $(el).find(retailer.priceSelector).first().text().trim();
      let stockText = $(el).find(retailer.stockSelector).text().trim() || 'In Stock';
      let productUrl = $(el).find(retailer.nameSelector).attr('href');

      if (name && productUrl) {
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
        
        // Skip if price is 0
        if (price === 0) return;

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
    console.log(`[${retailer.name}] Scraped ${products.length} items from ${categoryKey}`);
  } catch (err) {
    console.error(`Error scraping ${url}: ${err.message}`);
  }
  return products;
}

export async function scrapeAll() {
    console.log('Starting full scrape process...');
    setUpdating(true);
    let allProducts = [];

    for (const categoryKey of Object.keys(CATEGORIES)) {
        const categoryScrapers = Object.keys(RETAILERS).map(retailerKey =>
            scrapeRetailerCategory(retailerKey, categoryKey)
        );
        const results = await Promise.all(categoryScrapers);
        results.forEach(result => allProducts.push(...result));
    }
    
    // Normalize names (basic example)
    allProducts.forEach(p => {
        p.normalizedName = p.name.toLowerCase().replace(/\s+/g, ' ').trim();
    });

    setCache(allProducts);
    console.log(`Scraping complete. Total products found: ${allProducts.length}`);
    return allProducts;
}

// Vercel Cron Job handler
export default async function handler(req, res) {
  try {
    await scrapeAll();
    res.status(200).json({ success: true, message: 'Scrape job completed.' });
  } catch (error) {
    console.error('Cron handler failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
