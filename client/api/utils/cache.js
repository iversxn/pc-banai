let cache = {
  products: null,
  lastUpdated: null,
  isUpdating: false,
};

export const getCache = () => cache;

export const setCache = (newData) => {
  cache.products = newData;
  cache.lastUpdated = new Date();
  cache.isUpdating = false;
};

export const setUpdating = (status) => {
  cache.isUpdating = status;
}
