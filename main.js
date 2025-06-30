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

const renderIpAddressInfo = (info) => {
  const { ip, location, isp } = info;

  ipAddressBlock.innerText = ip;
  ipAddressLocationBlock.innerText = `${location.city}, ${location.region} ${location.postalCode}`;
  ipAddressTimezoneBlock.innerText = `UTC ${location.timezone}`;
  ipAddressIspBlock.innerText = isp ? isp : 'Not provided';
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
