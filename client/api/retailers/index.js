import { getCache } from '../utils/cache.js';
import { scrapeAll } from '../cron/update.js';

const CACHE_DURATION_MINUTES = 60;

export default async function handler(req, res) {
  const cache = getCache();
  const now = new Date();

  const isCacheStale = !cache.lastUpdated || (now - cache.lastUpdated) / (1000 * 60) > CACHE_DURATION_MINUTES;

  try {
    // If cache is empty or stale, and not already updating, start a new scrape
    if ((!cache.products || isCacheStale) && !cache.isUpdating) {
      console.log('Cache is empty or stale. Triggering scrape...');
      // Do not wait for scrapeAll to finish to reduce response time
      scrapeAll(); 
    }

    // If data is available, return it.
    if (cache.products) {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      return res.status(200).json({
        success: true,
        data: cache.products,
        lastUpdated: cache.lastUpdated,
      });
    } else {
      // If no data is available (e.g., first load and scrape is running), let the user know.
      return res.status(202).json({ 
        success: false, 
        message: 'Data is being updated. Please try again in a moment.' 
      });
    }
  } catch (err) {
    console.error('API Error in /api/retailers:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
