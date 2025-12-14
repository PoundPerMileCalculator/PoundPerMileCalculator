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
