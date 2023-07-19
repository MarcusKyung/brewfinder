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
    const closestBreweryAddress = data[0].street;
    const closestBreweryState = data[0].state;
    const closestBreweryPostalCode = data[0].postal_code;

    document.getElementById("infoCardDisplay").classList.add("infoCard")
    document.getElementById("closestBeer").innerHTML = closestBrewery;
    document.getElementById("closestBeerAddress").innerHTML = closestBreweryAddress + ", " + closestBreweryState + closestBreweryPostalCode;
} catch (error) {
    console.error("Error:", error);
    document.getElementById("closestBeer").innerHTML = "Geolocation must be enabled in your browser settings for this extension to work. Right click on extension, click View Web Permissions, then toggle Location to Allow.";
}
}

fetchData();