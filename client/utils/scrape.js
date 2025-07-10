// client/utils/scrape.js

export async function scrapeAllRetailers() {
  return {
    techland: [
      {
        name: "AMD Ryzen 5 5600X",
        price: 21000,
        stock: "In Stock",
        url: "https://www.techlandbd.com/amd-ryzen-5-5600x"
      }
    ],
    startech: [
      {
        name: "Intel Core i5-12400",
        price: 22000,
        stock: "Out of Stock",
        url: "https://www.startech.com.bd/intel-core-i5-12400"
      }
    ],
    skyland: [],
    ultratech: []
  };
}
