export default async function handler(req, res) {
  try {
    // 🔧 Simulate scraping again here
    const scrapedData = {
      techland: [
        {
          name: 'AMD Ryzen 5 5600X',
          price: 21000,
          stock: 'In Stock',
          url: 'https://www.techlandbd.com/amd-ryzen-5-5600x',
        },
      ],
      startech: [
        {
          name: 'Intel Core i5-12400',
          price: 22000,
          stock: 'Out of Stock',
          url: 'https://www.startech.com.bd/intel-core-i5-12400',
        },
      ],
      skyland: [],
      ultratech: [],
    };

    res.status(200).json({ success: true, data: scrapedData });
  } catch (err) {
    console.error('❌ Retailers API failed:', err);
    res.status(500).json({ success: false, error: 'Retailers API failed' });
  }
}
