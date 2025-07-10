import axios from 'axios';
import * as cheerio from 'cheerio';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
};

async function scrapeTechland() {
  try {
    const { data } = await axios.get('https://www.techlandbd.com/pc-components/processor', { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const products = [];

    $('.product-thumb').each((_, el) => {
      const name = $(el).find('.caption h4 a').text().trim();
      const priceText = $(el).find('.price-new, .price').first().text().trim().replace(/[^\d]/g, '');
      const price = parseInt(priceText, 10) || null;
      const url = $(el).find('.caption h4 a').attr('href');
      const stock = $(el).find('.stock span').text().trim() || 'Unknown';
      if (name && price && url) {
        products.push({ name, price, stock, url });
      }
    });

    return products;
  } catch (err) {
    console.error('Techland scrape error:', err.message);
    return [];
  }
}

async function scrapeStarTech() {
  try {
    const { data } = await axios.get('https://www.startech.com.bd/component/processor', { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const products = [];

    $('.p-item').each((_, el) => {
      const name = $(el).find('.p-item-name a').text().trim();
      const priceText = $(el).find('.p-item-price span').text().trim().replace(/[^\d]/g, '');
      const price = parseInt(priceText, 10) || null;
      const url = $(el).find('.p-item-name a').attr('href');
      const stock = $(el).find('.p-stock').text().trim() || 'Unknown';
      if (name && price && url) {
        products.push({ name, price, stock, url: `https://www.startech.com.bd${url}` });
      }
    });

    return products;
  } catch (err) {
    console.error('StarTech scrape error:', err.message);
    return [];
  }
}

async function scrapeSkyland() {
  try {
    const { data } = await axios.get('https://www.skyland.com.bd/components/processor', { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const products = [];

    $('.product-layout').each((_, el) => {
      const name = $(el).find('.caption a').text().trim();
      const priceText = $(el).find('.price').first().text().trim().replace(/[^\d]/g, '');
      const price = parseInt(priceText, 10) || null;
      const url = $(el).find('.caption a').attr('href');
      const stock = 'Unknown';
      if (name && price && url) {
        products.push({ name, price, stock, url });
      }
    });

    return products;
  } catch (err) {
    console.error('Skyland scrape error:', err.message);
    return [];
  }
}

async function scrapeUltratech() {
  try {
    const { data } = await axios.get('https://www.ultratech.com.bd/processor', { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const products = [];

    $('.product-thumb').each((_, el) => {
      const name = $(el).find('.caption a').text().trim();
      const priceText = $(el).find('.price').text().trim().replace(/[^\d]/g, '');
      const price = parseInt(priceText, 10) || null;
      const url = $(el).find('.caption a').attr('href');
      const stock = 'Unknown';
      if (name && price && url) {
        products.push({ name, price, stock, url });
      }
    });

    return products;
  } catch (err) {
    console.error('Ultratech scrape error:', err.message);
    return [];
  }
}

export default async function handler(req, res) {
  try {
    const [techland, startech, skyland, ultratech] = await Promise.all([
      scrapeTechland(),
      scrapeStarTech(),
      scrapeSkyland(),
      scrapeUltratech(),
    ]);

    res.status(200).json({
      success: true,
      message: 'Live retailer data scraped successfully.',
      data: { techland, startech, skyland, ultratech },
    });
  } catch (err) {
    console.error('Scraping failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
