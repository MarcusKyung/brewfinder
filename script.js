function getLocation() {
  return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => resolve(position),
              (error) => reject(error)
          );
      } else {
          reject("Geolocation is not supported by this browser.");
      }
  });
}

async function fetchData() {
  try {
      const position = await getLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}`);
      const data = await response.json();
      const closestBrewery = data[0].name;

      document.getElementById("closestBeer").innerHTML = closestBrewery;
  } catch (error) {
      console.error("Error:", error);
      document.getElementById("closestBeer").innerHTML = "Error fetching data.";
  }
}

fetchData();