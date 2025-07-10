let cachedData = {};

export function setRetailerData(data) {
  cachedData = data;
}
import { getRetailerData } from '@/utils/cache';

export function getRetailerData() {
  return cachedData;
}
