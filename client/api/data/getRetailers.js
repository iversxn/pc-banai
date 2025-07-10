import { getCachedRetailerData } from '../cron/update.js';

export default async function handler(req, res) {
  const data = getCachedRetailerData();
  if (data) {
    return res.status(200).json(data);
  } else {
    return res.status(503).json({ message: 'Retailer data not yet loaded.' });
  }
}
