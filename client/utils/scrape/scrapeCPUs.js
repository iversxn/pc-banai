import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeCPUs() {
  const results = {
    techland: [],
    startech: [],
    skyland: [],
    ultratech: [],
  };

  // Helper function to clean price text
  function cleanPriceText(priceText) {
    // Extract first valid price number from text
    const match = priceText.replace(/[^\d\s]/g, '').trim().match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  // Techland
  try {
    const baseUrl = 'https://www.techlandbd.com';
    const { data } = await axios.get(`${baseUrl}/pc-components/processor`);
    const $ = cheerio.load(data);

    $('.product-layout').each((_, el) => {
      const name = $(el).find('.name a').text().trim();
      const priceText = $(el).find('.price-normal').text() || $(el).find('.price').text();
      const price = cleanPriceText(priceText);
      const stock = $(el).find('.stock-status').text().includes('Out') ? 'Out of Stock' : 'In Stock';
      const href = $(el).find('.name a').attr('href');
      const url = new URL(href, baseUrl).href;

      if (name && price && url) {
        results.techland.push({ name, price, stock, url });
      }
    });
  } catch (err) {
    console.error('Techland scrape error:', err.message);
  }

  // StarTech - Fixed URL and price handling
  try {
    const baseUrl = 'https://www.startech.com.bd';
    const { data } = await axios.get(`${baseUrl}/component/processor`);
    const $ = cheerio.load(data);

    $('.p-item').each((_, el) => {
      const name = $(el).find('.p-item-name a').text().trim();
      
      // Handle prices with discount
      let priceText;
      const discountPrice = $(el).find('.p-price span').first().text().trim();
      if (discountPrice) {
        priceText = discountPrice;
      } else {
        priceText = $(el).find('.price').text().trim();
      }
      
      const price = cleanPriceText(priceText);
      const stock = $(el).find('.stock-status').text().includes('Out') ? 'Out of Stock' : 'In Stock';
      const href = $(el).find('.p-item-name a').attr('href');
      // Fix URL duplication
      const url = href.startsWith('http') ? href : `${baseUrl}${href}`;

      if (name && price && url) {
        results.startech.push({ name, price, stock, url });
      }
    });
  } catch (err) {
    console.error('StarTech scrape error:', err.message);
  }

  // Skyland - Improved selectors
  try {
    const baseUrl = 'https://www.skyland.com.bd';
    const { data } = await axios.get(`${baseUrl}/components/processor`);
    const $ = cheerio.load(data);

    $('.product-thumb').each((_, el) => {
      const name = $(el).find('.name a').text().trim();
      const priceText = $(el).find('.price-new').text() || $(el).find('.price').text();
      const price = cleanPriceText(priceText);
      const stock = $(el).find('.stock').text().includes('Out') ? 'Out of Stock' : 'In Stock';
      const href = $(el).find('.name a').attr('href');
      const url = new URL(href, baseUrl).href;

      if (name && price && url) {
        results.skyland.push({ name, price, stock, url });
      }
    });
  } catch (err) {
    console.error('Skyland scrape error:', err.message);
  }

  // Ultratech - Fixed price extraction
  try {
    const baseUrl = 'https://www.ultratech.com.bd';
    const { data } = await axios.get(`${baseUrl}/processor`);
    const $ = cheerio.load(data);

    $('.product-box').each((_, el) => {
      const name = $(el).find('.name a').text().trim();
      
      // Handle discounted prices
      let priceText;
      if ($(el).find('.price-new').length) {
        priceText = $(el).find('.price-new').text();
      } else {
        priceText = $(el).find('.price').text();
      }
      
      const price = cleanPriceText(priceText);
      const stock = $(el).find('.stock').text().includes('Out') ? 'Out of Stock' : 'In Stock';
      const href = $(el).find('.name a').attr('href');
      const url = new URL(href, baseUrl).href;

      if (name && price && url) {
        results.ultratech.push({ name, price, stock, url });
      }
    });
  } catch (err) {
    console.error('Ultratech scrape error:', err.message);
  }

  return results;
}
