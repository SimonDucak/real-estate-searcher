const axios = require("axios");
const cheerio = require('cheerio');
const fs = require('fs');

const URL = "https://www.nehnutelnosti.sk/slovensko/byty/prenajom/";

const FROM = 1;
const TO = 120;

const safelyParseNumber = (str) => {
    const parsedNumber = parseFloat(str);
    if (isNaN(parsedNumber)) {
        return null;
    }
    return parsedNumber;
}

const scrapeData = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const items = $(".advertisement-item").map((_i, el) => {
        const $el = $(el);
        const title = $el.find(".advertisement-item--content__title").text();
        const address = $el.find(".advertisement-item--content__info.d-block.text-truncate").text().trim();

        const [roomsString, meters] = $el.find(".advertisement-item--content__info").last().text().trim().split("•");
        const match = roomsString.match(/(\d+)/);
        const rooms = match ? match[1] : null;

        const priceString = $el.find(".advertisement-item--content__price").text().trim();
        const matches = priceString.match(/([\d\s]+) €.*([\d\s,]+) €/);
        const totalPrice = matches ? matches[1].replace(/\s/g, "") : null;
        const meterSquarePrice = matches ? matches[2].replace(/\s/g, "") : null;

        const pictureEls = $el.find("picture");
        const imagesUrls = [];

        pictureEls.each((_index, pictureEl) => {
            const dataSrcElements = $(pictureEl).find("data-src, data-img");
            dataSrcElements.each((i, element) => {
                const src = $(element).attr("data-src"); // Get the data-src attribute
                if (src) imagesUrls.push(src);
            });
        });

        const link = $el.find("a.advertisement-item--content__title").attr("href");

        return {
            title,
            address,
            rooms: safelyParseNumber(rooms),
            meters: meters ? safelyParseNumber(meters.replace("m²", "")) : null,
            totalPrice: safelyParseNumber(totalPrice),
            meterSquarePrice: safelyParseNumber(meterSquarePrice),
            link,
            imagesUrls,
        };
    }).get();

    return items;
};

const scrapePage = async (pageNumber) => {
    const url = `${URL}?p[page]=${pageNumber}`;
    const items = await scrapeData(url);

    fs.writeFileSync(`./for-rent/page-${pageNumber}.json`, JSON.stringify(items));

    console.log(`Page ${pageNumber} scraped`);
}

const scrapeAll = async () => {
    for (let i = FROM; i <= TO; i++) {
        try {
            await scrapePage(i);
        } catch (err) {
            console.error(`Error scraping page ${i}`, err);
        }
    }
}

scrapeAll();