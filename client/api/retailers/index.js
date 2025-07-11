import axios from 'axios';
import * as cheerio from 'cheerio';
import { RETAILERS, CATEGORIES } from '../../src/data/componentConfig.js';

const HEADERS = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36' };

const retailerSelectors = {
    techland: { product: '.product-layout', name: '.name a', price: '.price-new, .price-normal, .price', stock: '.stock span' },
    startech: { product: '.p-item', name: '.p-item-name a', price: '.p-item-price span', stock: '.p-stock' },
    skyland: { product: '.product-thumb', name: '.caption h4 a', price: '.price .price-new, .price', stock: 'p.stock' },
    ultratech: { product: '.product-thumb', name: '.caption h4 a', price: '.price-new, .price', stock: '.stock-status' },
};

// New, more robust normalization function
function getNormalizedKey(name) {
    return name.toLowerCase()
        .replace(/amd|intel|core|ryzen|series/g, '')
        .replace(/\s*\(.*\)\s*/g, '') // Remove text in parentheses
        .replace(/[^\w\d]/g, '') // Remove non-alphanumeric chars
        .trim();
}

async function scrapeCategory(categoryKey) {
    const category = CATEGORIES[categoryKey];
    if (!category) return [];

    const allProducts = [];
    const promises = Object.keys(RETAILERS).map(async (retailerKey) => {
        const urlPath = category.urls[retailerKey];
        if (!urlPath) return;

        const url = `${RETAILERS[retailerKey].urlBase}${urlPath}`;
        const selectors = retailerSelectors[retailerKey];

        try {
            const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
            const $ = cheerio.load(data);

            $(selectors.product).each((_, el) => {
                const name = $(el).find(selectors.name).text().trim();
                const priceText = $(el).find(selectors.price).first().text().trim();
                const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
                
                if (name && price > 0) {
                    const productUrl = new URL($(el).find(selectors.name).attr('href'), RETAILERS[retailerKey].urlBase).href;
                    const stockText = $(el).find(selectors.stock).text().trim() || 'In Stock';
                    const stock = /out of stock/i.test(stockText) ? 'Out of Stock' : 'In Stock';
                    
                    allProducts.push({
                        name,
                        price,
                        stock,
                        url: productUrl,
                        vendor: RETAILERS[retailerKey].name,
                        category: categoryKey,
                    });
                }
            });
        } catch (err) {
            console.error(`[API Scrape] Failed for ${url}: ${err.message}`);
        }
    });

    await Promise.all(promises);
    return allProducts;
}

export default async function handler(req, res) {
    const { category } = req.query;

    if (!category || !CATEGORIES[category]) {
        return res.status(400).json({ success: false, error: 'A valid category must be provided.' });
    }

    try {
        const liveProducts = await scrapeCategory(category);

        // Group products by a normalized name to create a unique product list
        const productGroups = new Map();
        liveProducts.forEach(p => {
            const key = getNormalizedKey(p.name);
            if (!productGroups.has(key)) {
                productGroups.set(key, {
                    displayName: p.name, // Use the name of the first one we see as the display name
                    offers: [],
                });
            }
            productGroups.get(key).offers.push(p);
        });

        // Sort offers within each group by price
        productGroups.forEach(group => group.offers.sort((a, b) => a.price - b.price));

        const uniqueProductList = Array.from(productGroups.values());

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600'); // 5 min cache
        return res.status(200).json({ success: true, data: uniqueProductList });

    } catch (err) {
        console.error(`[API] Handler failed for category ${category}:`, err);
        return res.status(500).json({ success: false, error: 'Failed to process request.' });
    }
}
