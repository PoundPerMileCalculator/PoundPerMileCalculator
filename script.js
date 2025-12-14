let vehiclesData = {};

fetch('vehicles.json')
  .then(res => res.json())
  .then(data => {
    vehiclesData = data;
    populateBrands();
  });

