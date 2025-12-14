const vehiclesData = {
  
  // Add all your other brands & models here
};

// Populate Brand Dropdown
const brandSelect = document.getElementById('brand');
const modelSelect = document.getElementById('model');
const areaSelect = document.getElementById('area');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const totalDiv = document.getElementById('totalCost');

function populateBrands() {
  Object.keys(vehiclesData).forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}
populateBrands();

// Update models when brand changes
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

function checkButtonState() {
  calculateBtn.disabled = !(brandSelect.value && modelSelect.value && areaSelect.value);
}

modelSelect.addEventListener('change', checkButtonState);
areaSelect.addEventListener('change', checkButtonState);

// You can keep your calculate button logic as before
// DOM Elements
const brandSelect = document.getElementById('brand');
const modelSelect = document.getElementById('model');
const areaSelect = document.getElementById('area');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const totalDiv = document.getElementById('totalCost');

let vehiclesData = {}; // Will hold JSON vehicle data

// Fuel & Energy Prices per region
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

// Load vehicles.json
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

// Populate brand dropdown
function populateBrands() {
  Object.keys(vehiclesData).sort().forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// Update model dropdown when brand changes
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

// Enable/disable calculate button
modelSelect.addEventListener('change', checkButtonState);
areaSelect.addEventListener('change', checkButtonState);

function checkButtonState() {
  calculateBtn.disabled = !(brandSelect.value && modelSelect.value && areaSelect.value);
}

// Calculate £/mile and total cost
calculateBtn.addEventListener('click', () => {
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const area = areaSelect.value;

  if (!vehiclesData[brand]) {
    resultDiv.innerText = 'Vehicle data not found.';
    totalDiv.innerText = '';
    return;
  }

  const vehicle = vehiclesData[brand].find(v => v.model === model);
  if (!vehicle) {
    resultDiv.innerText = 'Model data not found.';
    totalDiv.innerText = '';
    return;
  }

  let costPerMile = 0;

  // Petrol
  if (vehicle.fuel === 'petrol') {
    costPerMile = (fuelPrices[area].petrol / 100) / vehicle.mpg;
  }
  // Diesel
  else if (vehicle.fuel === 'diesel') {
    costPerMile = (fuelPrices[area].diesel / 100) / vehicle.mpg;
  }
  // Electric
  else if (vehicle.fuel === 'electric') {
    costPerMile = (energyPrices[area] / 100) * vehicle.kwh_per_mile;
  }
  // Fun or missing type
  else {
    costPerMile = 10; // arbitrary fallback
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
