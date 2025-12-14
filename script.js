// DOM Elements
const brandSelect = document.getElementById('brand');
const modelSelect = document.getElementById('model');
const areaSelect = document.getElementById('area');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const totalDiv = document.getElementById('totalCost');

let vehiclesData = {};

// --- Fuel & Energy Prices per area ---
const fuelPrices = {
  "Wales": { petrol: 135, diesel: 143 },
  "Scotland": { petrol: 135, diesel: 144 },
  "North England": { petrol: 136, diesel: 145 },
  "East England": { petrol: 137, diesel: 145 },
  "South England": { petrol: 138, diesel: 146 },
  "West England": { petrol: 136, diesel: 144 },
  "London": { petrol: 138, diesel: 146 }
};

const energyPrices = {
  "Wales": 25.8,
  "Scotland": 26.0,
  "North England": 25.0,
  "East England": 26.0,
  "South England": 26.9,
  "West England": 26.0,
  "London": 26.05
};

// --- Load vehicles.json ---
fetch('vehicles.json')
  .then(res => {
    if (!res.ok) throw new Error('Could not load vehicles.json');
    return res.json();
  })
  .then(data => {
    vehiclesData = data;
    populateBrands();
  })
  .catch(err => {
    console.error('Error loading vehicles.json:', err);
    resultDiv.innerText = 'Error loading vehicle data. Check console.';
  });

// --- Populate Brand Dropdown ---
function populateBrands() {
  Object.keys(vehiclesData).forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// --- Update Model Dropdown on Brand Change ---
brandSelect.addEventListener('change', () => {
  const brand = brandSelect.value;
  modelSelect.innerHTML = '<option value="">--Select Model--</option>';
  modelSelect.disabled = !brand;

  if (brand && vehiclesData[brand]) {
    vehiclesData[brand].forEach(vehicle => {
      const option = document.createElement('option');
      option.value = vehicle.model;
      option.textContent = vehicle.model;
      modelSelect.appendChild(option);
    });
  }

  checkButtonState();
});

// --- Enable/Disable Calculate Button ---
modelSelect.addEventListener('change', checkButtonState);
areaSelect.addEventListener('change', checkButtonState);

function checkButtonState() {
  calculateBtn.disabled = !(brandSelect.value && modelSelect.value && areaSelect.value);
}

// --- Calculate £/mile and Total Cost ---
calculateBtn.addEventListener('click', () => {
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const area = areaSelect.value;

  if (!vehiclesData[brand]) {
    resultDiv.innerText = 'Vehicle data not found.';
    return;
  }

  const vehicle = vehiclesData[brand].find(v => v.model === model);
  if (!vehicle) {
    resultDiv.innerText = 'Model data not found.';
    return;
  }

  let costPerMile = 0;

  switch(vehicle.fuel) {
    case 'petrol':
      costPerMile = (fuelPrices[area].petrol / 100) / vehicle.mpg;
      break;
    case 'diesel':
      costPerMile = (fuelPrices[area].diesel / 100) / vehicle.mpg;
      break;
    case 'electric':
      if (!vehicle.kwh_per_mile) {
        resultDiv.innerText = 'Electric vehicle missing kWh per mile data.';
        return;
      }
      costPerMile = (energyPrices[area] / 100) * vehicle.kwh_per_mile;
      break;
    default:
      costPerMile = 10; // fallback for fun vehicles or missing fuel type
  }

  resultDiv.innerText = `Estimated cost to run ${brand} ${model} in ${area}: £${costPerMile.toFixed(2)} per mile.`;

  // Prompt for miles traveled
  const milesInput = prompt("How many miles will you be traveling?");
  if (milesInput && !isNaN(milesInput)) {
    const totalMiles = parseFloat(milesInput);
    const totalCost = costPerMile * totalMiles;
    totalDiv.innerText = `Total estimated cost for ${totalMiles} miles: £${totalCost.toFixed(2)}`;
  } else {
    totalDiv.innerText = '';
  }
});
