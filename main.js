import ipLocationService from './services/ip-locations.js';
import validation from './helpers/validation-helpers.js';

const inputField = document.querySelector('#ip-address-input-field > input');
const inputFieldButton = document.querySelector(
  '#ip-address-input-field > button'
);

const ipAddressInfoBlock = document.querySelector('.ip-address-info');
const ipAddressBlock = document.querySelector('.ip-address');
const ipAddressLocationBlock = document.querySelector('.ip-address-location');
const ipAddressTimezoneBlock = document.querySelector('.ip-address-timezone');
const ipAddressIspBlock = document.querySelector('.ip-address-isp');

const errorBlock = document.querySelector('.error');

let map;

const showError = (...messages) => {
  ipAddressInfoBlock.style.display = 'none';
  errorBlock.style.display = 'flex';

  let errorHtml = '';
  messages.forEach((message) => {
    errorHtml += `<p>${message}</p>`;
  });
  errorBlock.innerHTML = errorHtml;
};

const hideError = () => {
  ipAddressInfoBlock.style.display = 'flex';
  errorBlock.style.display = 'none';
};

const renderMap = (latitude, longitude) => {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([latitude, longitude], 17);
  map.removeControl(map.zoomControl);

  const tileUrl =
    'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=2WVD8zquwSbYnm8zCfZp';
  const attribution =
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  L.tileLayer(tileUrl, {
    maxZoom: 20,
    attribution,
  }).addTo(map);

  const icon = L.icon({
    iconUrl: './images/icon-location.svg',
  });

  L.marker([latitude, longitude], { icon }).addTo(map);
};

const renderIpAddressInfo = (info) => {
  const { ip, location, isp } = info;
  const {
    city,
    region,
    postalCode,
    timezone,
    lat: latitude,
    lng: longitude,
  } = location;

  ipAddressBlock.innerText = ip;
  ipAddressLocationBlock.innerText = `${city}, ${region} ${postalCode}`;
  ipAddressTimezoneBlock.innerText = `UTC ${timezone}`;
  ipAddressIspBlock.innerText = isp ? isp : 'Not provided';

  renderMap(latitude, longitude);
};

const getClientIpAddressInfo = () => {
  ipLocationService
    .getLocationDataByIpAddress()
    .then((data) => {
      hideError();
      renderIpAddressInfo(data);
    })
    .catch((e) => {
      showError(e.message);
    });
};

const getIpAddressInfo = () => {
  const { value: inputValue } = inputField;

  if (inputValue.trim() === '') return;

  inputField.value = '';

  let getLocationData;
  if (validation.isValidIpAddress(inputValue)) {
    getLocationData = ipLocationService.getLocationDataByIpAddress;
  } else if (validation.isValidDomain(inputValue)) {
    getLocationData = ipLocationService.getLocationDataByDomain;
  } else {
    showError(
      `<span style="word-break: break-all;">"${inputValue}"</span> is not a correct IP address or domain.`,
      'Please retry with the correct value.'
    );
    return;
  }

  getLocationData(inputValue)
    .then((data) => {
      hideError();
      renderIpAddressInfo(data);
    })
    .catch((e) => {
      showError(e.message);
    });
};

getClientIpAddressInfo();

inputFieldButton.addEventListener('click', getIpAddressInfo);

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    getIpAddressInfo();
  }
});
