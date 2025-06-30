const isValidDomain = (url) => {
  // Source: https://emad-uddin.medium.com/domain-name-validation-using-regex-in-javascript-0a9c2ba342b9
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;

  return domainRegex.test(url);
};

const isValidIpAddress = (ip) => {
  // Source: https://medium.com/@stheodorejohn/validating-ipv4-and-ipv6-addresses-with-ease-unveiling-the-power-of-validation-in-javascript-2af04ee065c5
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;

  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    for (let part of parts) {
      if (parseInt(part) > 255) {
        return false;
      }
    }
    return true;
  }

  if (ipv6Regex.test(ip)) {
    const parts = ip.split(':');
    for (let part of parts) {
      if (part.length > 4) {
        return false;
      }
    }
    return true;
  }

  return false;
};

export default { isValidDomain, isValidIpAddress };
