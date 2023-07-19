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

async function createButtons(data) {
    const buttonContainer = document.getElementById("buttonContainer");

    const openBreweryButton = document.createElement("button");
    openBreweryButton.textContent = "Visit OpenBreweryDB";
    openBreweryButton.addEventListener("click", () => {
        window.open("https://www.openbrewerydb.org/", "_blank");
    });
    buttonContainer.appendChild(openBreweryButton);

    if (data[0].website_url) {
        const breweryHomepageButton = document.createElement("button");
        breweryHomepageButton.textContent = "Visit Brewery Webpage";
        breweryHomepageButton.addEventListener("click", () => {
            window.open(data[0].website_url, "_blank");
        });
        buttonContainer.appendChild(breweryHomepageButton);
    } else {
        const breweryNoHomepageButton = document.createElement("button");
        breweryNoHomepageButton.textContent = "No Brewery Webpage Available";
        buttonContainer.appendChild(breweryNoHomepageButton);
    }
}

async function fetchData() {
    try {
        // Show the loading indicator before fetching data
        const loadingIndicator = document.getElementById("loadingIndicator");
        loadingIndicator.style.display = "block";

        const position = await getLocation();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}`);
        const data = await response.json();
        const closestBrewery = data[0].name;
        const closestBreweryAddress = data[0].street;
        const closestBreweryState = data[0].state;
        const closestBreweryPostalCode = data[0].postal_code;

        document.getElementById("infoCardDisplay").classList.add("infoCard");
        document.getElementById("closestBeer").innerHTML = closestBrewery;
        document.getElementById("closestBeerAddress").innerHTML = closestBreweryAddress + ", " + closestBreweryState + closestBreweryPostalCode;

        createButtons(data);

        // Hide the loading indicator after data is fetched and displayed
        loadingIndicator.style.display = "none";
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("closestBeer").innerHTML = "This extension has encountered an error. Geolocation must be enabled in your browser settings for this extension to work. Right click on extension, click View Web Permissions, then toggle Location to Allow.";

        // Hide the loading indicator in case of an error
        const loadingIndicator = document.getElementById("loadingIndicator");
        loadingIndicator.style.display = "none";
    }
}


fetchData();
