import { IPIFY_API_KEY } from '../config/config.js';

const BASE_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${IPIFY_API_KEY}`;

const get = async (url) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    }

    throw new Error('Failed to fetch data for this IP address or domain');
  } catch (e) {
    throw new Error(e.message);
  }
};

const getLocationDataByIpAddress = async (ip) => {
  const query = ip ? `&ipAddress=${ip}` : '';
  const url = BASE_URL + query;

  return await get(url);
};

const getLocationDataByDomain = async (domain) => {
  const url = BASE_URL + `&domain=${domain}`;

  return await get(url);
};

export default { getLocationDataByIpAddress, getLocationDataByDomain };
