// const axios = require("axios");
// const readline = require('readline-sync');
// const cheerio = require('cheerio');

// const getLocations = async (search) => {
//     const url = "https://www.nehnutelnosti.sk/api/location-tree/getNodesForFulltext/";

//     const data = { "data[fulltext]": search };

//     const response = await axios.post(url, data, {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded', // Ensure correct content type
//             'Accept': 'application/json', // Accept JSON responses
//         }
//     });

//     console.log(response.data);
// }

// getLocations("Popr");

// const category = {
//     BUY: "24",
//     RENT: "2",
// }

// const getUrls = async (id) => {
//     const params = {
//         'p[location]': id,
//         'p[param3]': category.BUY,
//         'p[categories][]': '1',
//         'p[param1][from]': '',
//         'p[param1][to]': '',
//         'p[param11][from]': '',
//         'p[param11][to]': '',
//         'p[keyword]': ''
//     };
//     const headers = { 'Accept': 'application/json' }
//     const buyResponse = await axios.get('https://www.nehnutelnosti.sk/api/search/url/', {
//         params: params,
//         headers: headers,
//     });
//     params["p[param3]"] = category.RENT;
//     const rentResponse = await axios.get('https://www.nehnutelnosti.sk/api/search/url/', {
//         params: params,
//         headers: headers,
//     });
//     return [buyResponse.data.data.url, rentResponse.data.data.url];
// }

// const safelyParseNumber = (str) => {
//     const parsedNumber = parseFloat(str);
//     if (isNaN(parsedNumber)) {
//         return null;
//     }
//     return parsedNumber;
// }

// const scrapeData = async (url) => {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const items = $(".advertisement-item").map((i, el) => {
//         const $el = $(el);
//         const title = $el.find(".advertisement-item--content__title").text();
//         const address = $el.find(".advertisement-item--content__info.d-block.text-truncate").text().trim();

//         const [roomsString, meters] = $el.find(".advertisement-item--content__info").last().text().trim().split("•");
//         const match = roomsString.match(/(\d+)/);
//         const rooms = match ? match[1] : null;

//         const priceString = $el.find(".advertisement-item--content__price").text().trim();
//         const matches = priceString.match(/([\d\s]+) €.*([\d\s,]+) €/);
//         const totalPrice = matches ? matches[1].replace(/\s/g, "") : null;
//         const meterSquarePrice = matches ? matches[2].replace(/\s/g, "") : null;

//         const link = $el.find("a.advertisement-item--content__title").attr("href");

//         return {
//             title,
//             address,
//             rooms: safelyParseNumber(rooms),
//             meters: meters ? safelyParseNumber(meters.replace("m²", "")) : null,
//             totalPrice: safelyParseNumber(totalPrice),
//             meterSquarePrice: safelyParseNumber(meterSquarePrice),
//             link,
//         };
//     }).get();

//     return items;
// }

// const getData = async () => {
//     // const location = readline.question("Enter location: ");
//     // const foundLocations = await getLocations(location);
//     // console.log(foundLocations);
//     // const locationId = readline.question("Enter location ID: ");
//     const [buyUrl, rentUrl] = await getUrls("t95");
//     console.log(buyUrl, rentUrl);
//     const data = await scrapeData(buyUrl);
//     console.log(data);
// }

// // getData();

const fs = require('fs');

const json = fs.readFileSync('mergedDataArray.json');

const data = JSON.parse(json);

console.log(data.length);