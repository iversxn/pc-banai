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

// Smarter normalization focusing on model numbers
function getNormalizedKey(name) {
    const lower = name.toLowerCase();
    // Extract specific model numbers like 5600x, 13700k, b550, z790, rtx3060, etc.
    const modelMatch = lower.match(/(i[3579]-?\d{4,5}k?f?|ryzen\s?\d{1,2}\s?\d{4}x?g?|b\d{2,3}m?|x\d{2,3}|z\d{2,3}|rtx\s?\d{4}|rx\s?\d{4})/);
    if (modelMatch) return modelMatch[0].replace(/\s/g, '');

    // Fallback for other components
    return lower.replace(/\(.*\)|\[.*\]/g, '').replace(/[^\w\d]/g, '').trim();
}

// New function to add compatibility tags on the backend
function addCompatibilityTags(product, category) {
    const name = product.displayName.toLowerCase();
    if (category === 'Motherboard') {
        if (name.includes('am5') || name.includes('x670') || name.includes('b650')) product.socket = 'AM5';
        if (name.includes('am4') || name.includes('b550') || name.includes('b450') || name.includes('x570')) product.socket = 'AM4';
        if (name.includes('lga1700') || name.includes('z790') || name.includes('b760') || name.includes('z690')) product.socket = 'LGA1700';
        if (name.includes('ddr5')) product.memoryType = 'DDR5';
        if (name.includes('ddr4')) product.memoryType = 'DDR4';
    }
    if (category === 'RAM') {
        if (name.includes('ddr5')) product.memoryType = 'DDR5';
        if (name.includes('ddr4')) product.memoryType = 'DDR4';
    }
    return product;
}

async function scrapeAllOffersForCategory(categoryKey) {
    // ... (scraping logic remains the same as the previous version)
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
                
                if (name && price > 100) {
                    const productUrl = new URL($(el).find(selectors.name).attr('href'), RETAILERS[retailerKey].urlBase).href;
                    const stockText = $(el).find(selectors.stock).text().trim() || 'In Stock';
                    const stock = /out of stock/i.test(stockText) ? 'Out of Stock' : 'In Stock';
                    
                    allOffers.push({ name, price, stock, url: productUrl, vendor: RETAILERS[retailerKey].name, category: categoryKey });
                }
            });
        } catch (err) {
            // Don't kill the whole process if one retailer fails
        }
    });

    await Promise.all(promises);
    return allOffers;
}

export default async function handler(req, res) {
    const { category } = req.query;
    if (!category || !CATEGORIES[category]) return res.status(400).json({ success: false, error: 'A valid category is required.' });

    try {
        const allLiveOffers = await scrapeAllOffersForCategory(category);
        const productCatalog = new Map();

        allLiveOffers.forEach(offer => {
            const key = getNormalizedKey(offer.name);
            if (!key) return;

            if (!productCatalog.has(key)) {
                productCatalog.set(key, { displayName: offer.name, allOffers: [] });
            }
            const product = productCatalog.get(key);
            if (offer.name.length < product.displayName.length) {
                product.displayName = offer.name;
            }
            product.allOffers.push(offer);
        });

        let result = Array.from(productCatalog.values());

        // Add compatibility tags after grouping
        result.forEach(p => addCompatibilityTags(p, category));

        result.forEach(p => p.allOffers.sort((a, b) => a.price - b.price));
        result.sort((a, b) => a.allOffers[0].price - b.allOffers[0].price);

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json({ success: true, data: result });

    } catch (err) {
        return res.status(500).json({ success: false, error: 'Failed to process request.' });
    }
}
