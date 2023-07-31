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

function displayGreeting() {
    let randomNum = Math.floor(Math.random() * 5) + 1;
    console.log(randomNum);

    let greeting;
    let language; 

    if (randomNum === 1) {
        greeting = "Cheers!";
        language = " (English)";
    } else if (randomNum === 2) {
        greeting = "Prost!";
        language = " (German)";
    } else if (randomNum === 3) {
        greeting = "Salud!";
        language = " (Spanish)";
    } else if (randomNum === 4) {
        greeting = "Sláinte!";
        language = " (Irish)";
    } else {
        greeting = "Skål!";
        language = " (Swedish)";
    }

    document.getElementById("greetingDisplay").classList.add("greetingStyling");
    document.getElementById("greetingDisplay").innerHTML = greeting; 
    document.getElementById("greetingDisplay").setAttribute("data-language", language);

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
        const closestBeerType = data[0].brewery_type;
        const closestBeerTypeFirst = closestBeerType.charAt(0).toUpperCase();
        const closestBeerTypeRest = closestBeerType.slice(1);

        document.getElementById("infoCardDisplay").classList.add("infoCard");
        document.getElementById("closestBeer").innerHTML = closestBrewery + " - " + closestBeerTypeFirst + closestBeerTypeRest;
        document.getElementById("closestBeerAddress").innerHTML = closestBreweryAddress + ", " + closestBreweryState + closestBreweryPostalCode;

        createButtons(data);
        displayGreeting();

        loadingIndicator.style.display = "none";
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("closestBeer").innerHTML = "This extension has encountered an error. Geolocation must be enabled in your browser settings for this extension to work. Right click on extension, click View Web Permissions, then toggle Location to Allow.";

        const loadingIndicator = document.getElementById("loadingIndicator");
        loadingIndicator.style.display = "none";
    }
}


fetchData();
