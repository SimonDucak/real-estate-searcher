const axios = require("axios");
const fs = require("fs");

const getCoordinates = async (address) => {
    const mapboxUrl = 'https://api.mapbox.com';
    const token = "pk.eyJ1Ijoic2ltb25kdWNhayIsImEiOiJjbHJsMno4bW4wZ2I3MmxtcHV6Ym1ianZlIn0.0OuSicVTPv7mvnOTDKDngA";
    const url = `${mapboxUrl}/geocoding/v5/mapbox.places/${address}.json?access_token=${token}`;
    const { data } = await axios.get(url);

    const features = data.features;

    if (!features.length) return;

    return {
        searchQuery: address,
        addressData: features[0],
    }
}

// getCoordinates("Revolučná Štvrť, Galanta, okres Galanta");

//const forRentJson = require("./for-rent-merged.json");
//const forSaleJson = require("./for-sale-merged.json");

//const data = [...forRentJson, ...forSaleJson];

const data = require("./mapped/not-found.json");

const addresses = data.map((item) => item.address);

const uniqueAddresses = [...new Set(addresses)];

const getAllCoordinates = async () => {
    const data = [];

    for (let i = 0; i < uniqueAddresses.length; i++) {
        try {
            const address = uniqueAddresses[i];
            const coordinates = await getCoordinates(address);
            data.push(coordinates);
            console.log(`${i + 1}/${uniqueAddresses.length} - Fetched coordinates for ${address}`);
        } catch (err) {
            console.log("================================ Error ================================");
            console.error(`Error fetching coordinates for ${uniqueAddresses[i]}: ${err}`);
            console.log("=======================================================================");
        }
    }

    fs.writeFileSync("./coordinates-2.json", JSON.stringify(data, null, 2));
};

getAllCoordinates();