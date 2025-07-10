// File: client/api/retailers/index.js

export default function handler(req, res) {
  try {
    const cachedData = global.cachedRetailerData || {};
    res.status(200).json({ success: true, data: cachedData });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
