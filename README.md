pound-per-mile/
├── index.html
├── style.css
├── script.js
├── prices.json
└── README.md

{
  "petrol": 1.45,
  "diesel": 1.55,
  "electric": 0.28
}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pound Per Mile Calculator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<h1>Pound Per Mile Calculator</h1>

<section>
  <h2>Enter Vehicle Registration</h2>
  <input type="text" id="regInput" placeholder="e.g. AB12CDE">
  <button onclick="lookupVehicle()">Check Vehicle</button>
</section>

<section id="vehicleConfirm" style="display:none;">
  <h2>Is this your vehicle?</h2>
  <p id="vehicleDetails"></p>
  <button onclick="confirmVehicle(true)">Yes</button>
  <button onclick="confirmVehicle(false)">No</button>
</section>

<section id="calculator" style="display:none;">
  <h2>Efficiency</h2>

  <label id="efficiencyLabel"></label>
  <input type="number" id="efficiencyInput" step="0.01">

  <button onclick="calculate()">Calculate £/mile</button>
  <h3 id="result"></h3>
</section>

<script src="script.js"></script>
</body>
</html>

body {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: auto;
}

input, button {
  padding: 8px;
  margin-top: 5px;
}

let vehicle = {};
let prices = {};

fetch("prices.json")
  .then(res => res.json())
  .then(data => prices = data);

// MOCK VEHICLE LOOKUP (replace later with real API)
function lookupVehicle() {
  const reg = document.getElementById("regInput").value.toUpperCase();

  // Simulated response (as if from TotalCarCheck-like API)
  vehicle = {
    reg,
    make: "Ford",
    model: "Fiesta",
    fuel: "petrol"
  };

  document.getElementById("vehicleDetails").innerText =
    `${vehicle.make} ${vehicle.model} (${vehicle.fuel})`;

  document.getElementById("vehicleConfirm").style.display = "block";
}

function confirmVehicle(isCorrect) {
  if (!isCorrect) {
    alert("Please check the registration.");
    return;
  }

  document.getElementById("vehicleConfirm").style.display = "none";
  document.getElementById("calculator").style.display = "block";

  if (vehicle.fuel === "electric") {
    document.getElementById("efficiencyLabel").innerText =
      "Enter efficiency (kWh per mile)";
  } else {
    document.getElementById("efficiencyLabel").innerText =
      "Enter efficiency (MPG)";
  }
}

function calculate() {
  const efficiency = parseFloat(document.getElementById("efficiencyInput").value);
  let costPerMile;

  if (vehicle.fuel === "electric") {
    costPerMile = prices.electric * efficiency;
  } else {
    const milesPerLitre = efficiency / 4.546;
    costPerMile = prices[vehicle.fuel] / milesPerLitre;
  }

  document.getElementById("result").innerText =
    `Cost per mile: £${costPerMile.toFixed(3)}`;
}

## Pound Per Mile Calculator

This tool converts vehicle energy usage into a universal £/mile figure.

### How it works
1. Enter registration
2. Confirm vehicle details
3. Enter efficiency
4. Weekly regional energy prices applied
5. £ per mile calculated

### Data Sources
- Vehicle identification: API placeholder
- Fuel prices: Weekly manual update
