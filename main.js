import IPLocationService from './services/ip-locations.js';
import validation from './helpers/validation-helpers.js';

const inputField = document.querySelector('#ip-address-input-field > input');
const inputFieldButton = document.querySelector(
  '#ip-address-input-field > button'
);

const IPAddressDetailsBlock = document.querySelector('.ip-address-details');
const IPAddressBlock = document.querySelector('.ip-address');
const IPAddressLocationBlock = document.querySelector('.ip-address-location');
const IPAddressTimezoneBlock = document.querySelector('.ip-address-timezone');
const IPAddressIspBlock = document.querySelector('.ip-address-isp');

const errorBlock = document.querySelector('.error');

const showError = (...messages) => {
  IPAddressDetailsBlock.style.display = 'none';
  errorBlock.style.display = 'flex';

  let errorHtml = '';
  messages.forEach((message) => {
    errorHtml += `<p>${message}</p>`;
  });
  errorBlock.innerHTML = errorHtml;
};

const hideError = () => {
  IPAddressDetailsBlock.style.display = 'flex';
  errorBlock.style.display = 'none';
};

const updateIPAddressOrDomainDetails = (IPAddressInfo) => {
  const { ip, location, isp } = IPAddressInfo;

  IPAddressBlock.innerText = ip;
  IPAddressLocationBlock.innerText = `${location.city}, ${location.region} ${location.postalCode}`;
  IPAddressTimezoneBlock.innerText = `UTC ${location.timezone}`;
  IPAddressIspBlock.innerText = isp ? isp : 'Not provided';
};

const getClientIPAddressDetails = () => {
  IPLocationService.getIPAddressData()
    .then((data) => {
      hideError();
      updateIPAddressOrDomainDetails(data);
    })
    .catch((e) => {
      showError(e.message);
    });
};

const getIPAddressOrDomainDetails = () => {
  const { value } = inputField;

  let getData;
  if (validation.isValidIPAddress(value)) {
    getData = IPLocationService.getIPAddressData;
  } else if (validation.isValidDomain(value)) {
    getData = IPLocationService.getDomainData;
  } else {
    showError(
      `<span style="word-break: break-all;">"${value}"</span> is not a correct IP address or domain.`,
      'Please retry with the correct value.'
    );
    return;
  }

  getData(value)
    .then((data) => {
      hideError();
      updateIPAddressOrDomainDetails(data);
    })
    .catch((e) => {
      showError(e.message);
    });
};

getClientIPAddressDetails();

inputFieldButton.addEventListener('click', getIPAddressOrDomainDetails);

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    getIPAddressOrDomainDetails();
  }
});
