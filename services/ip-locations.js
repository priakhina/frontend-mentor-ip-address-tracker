const API_KEY = '<YOUR_API_KEY>';
const BASE_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;

const get = async (endpoint) => {
  try {
    const response = await fetch(endpoint);

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.log(e);
  }
};

const getIPAddressData = async (IPAddress) => {
  const IPAddressQuery = IPAddress ? `&ipAddress=${IPAddress}` : '';
  const endpoint = BASE_URL + IPAddressQuery;

  return await get(endpoint);
};

const getDomainData = async (domain) => {
  const endpoint = BASE_URL + `&domain=${domain}`;

  return await get(endpoint);
};

export default { getIPAddressData, getDomainData };
