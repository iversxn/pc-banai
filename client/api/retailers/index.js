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

// The new, smarter normalization engine.
// It preserves model numbers and key identifiers.
function getNormalizedKey(name) {
    return name.toLowerCase()
        .replace(/\(.*\)|\[.*\]/g, '') // Remove anything in parentheses or brackets
        .replace(/amd|intel|core|ryzen|series|gaming|desktop|processor|graphics|card|ddr[45]|pcie/g, '')
        .replace(/geforce|rtx|gtx|radeon|vega/g, '')
        .replace(/\b\d+-core\b/g, '') // remove "6-core" etc.
        .replace(/mhz|ghz|gb|tb|watt|w/g, '')
        .replace(/[^\w\d]/g, '') // Remove all non-alphanumeric characters
        .trim();
}

async function scrapeAllOffersForCategory(categoryKey) {
    const category = CATEGORIES[categoryKey];
    if (!category) return [];

    const allOffers = [];
    const promises = Object.keys(RETAILERS).map(async (retailerKey) => {
        const urlPath = category.urls[retailerKey];
        if (!urlPath) return;

        const url = `${RETAILERS[retailerKey].urlBase}${urlPath}`;
        const selectors = retailerSelectors[retailerKey];

        try {
            const { data } = await axios.get(url, { headers: HEADERS, timeout: 20000 });
            const $ = cheerio.load(data);

            $(selectors.product).each((_, el) => {
                const name = $(el).find(selectors.name).text().trim();
                const priceText = $(el).find(selectors.price).first().text().trim();
                const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
                
                if (name && price > 100) { // Filter out accessories or invalid prices
                    const productUrl = new URL($(el).find(selectors.name).attr('href'), RETAILERS[retailerKey].urlBase).href;
                    const stockText = $(el).find(selectors.stock).text().trim() || 'In Stock';
                    const stock = /out of stock/i.test(stockText) ? 'Out of Stock' : 'In Stock';
                    
                    allOffers.push({ name, price, stock, url: productUrl, vendor: RETAILERS[retailerKey].name, category: categoryKey });
                }
            });
        } catch (err) {
            console.error(`[API Scrape] Failed for ${url}: ${err.message}`);
        }
    });

    await Promise.all(promises);
    return allOffers;
}

export default async function handler(req, res) {
    const { category } = req.query;

    if (!category || !CATEGORIES[category]) {
        return res.status(400).json({ success: false, error: 'A valid category must be provided.' });
    }

    try {
        // 1. Get all raw offers from every retailer
        const allLiveOffers = await scrapeAllOffersForCategory(category);

        // 2. Group these offers into canonical products using the smart normalization key
        const productCatalog = new Map();
        allLiveOffers.forEach(offer => {
            const key = getNormalizedKey(offer.name);
            if (!key) return; // Skip if normalization results in an empty key

            if (!productCatalog.has(key)) {
                productCatalog.set(key, {
                    // Use the shortest name as the display name, it's often the cleanest
                    displayName: offer.name, 
                    allOffers: [],
                });
            }
            
            const product = productCatalog.get(key);
            // Use the shortest, cleanest name for the group
            if (offer.name.length < product.displayName.length) {
                product.displayName = offer.name;
            }
            product.allOffers.push(offer);
        });

        // 3. Sort offers within each product by price
        productCatalog.forEach(product => product.allOffers.sort((a, b) => a.price - b.price));

        // 4. Convert map to array and send to frontend
        const result = Array.from(productCatalog.values());

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json({ success: true, data: result });

    } catch (err) {
        console.error(`[API] Handler failed for category ${category}:`, err);
        return res.status(500).json({ success: false, error: 'Failed to process request.' });
    }
}
