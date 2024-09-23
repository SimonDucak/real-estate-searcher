
const fs = require("fs");
const forRent = require("./mapped/for-rent-mapped.json");
const forSale = require("./mapped/for-sale-mapped.json");

const minifyRentData = forRent.map((item) => {
    const { addressData, ...rest } = item;
    return {
        ...rest,
        coors: addressData ? addressData.geometry.coordinates : null,
    }
});

const minifySaleData = forSale.map((item) => {
    const { addressData, ...rest } = item;
    return {
        ...rest,
        coors: addressData ? addressData.geometry.coordinates : null,
    }
});

fs.writeFileSync("./mapped/for-rent-minified.json", JSON.stringify(minifyRentData, null, 2));
fs.writeFileSync("./mapped/for-sale-minified.json", JSON.stringify(minifySaleData, null, 2));








// const fs = require("fs");
// const forRent = require("./for-rent-merged.json");
// const forSale = require("./for-sale-merged.json");
// const coors = require("./coordinates.json");

// const mappedData = forSale.map((item) => {
//     if (item.addressData) return item;
//     const foundCoors = coors.find((coor) => coor.searchQuery === item.address);
//     if (!foundCoors) return item;
//     return {
//         ...item,
//         addressData: foundCoors.addressData,
//     };
// });

// fs.writeFileSync("./mapped/for-sale-mapped.json", JSON.stringify(mappedData, null, 2));

// const notFoundSale = mappedData.filter((item) => !item.addressData);

// const mappedDataRent = forRent.map((item) => {
//     if (item.addressData) return item;
//     const foundCoors = coors.find((coor) => coor.searchQuery === item.address);
//     if (!foundCoors) return item;
//     return {
//         ...item,
//         addressData: foundCoors.addressData,
//     };
// });

// fs.writeFileSync("./mapped/for-rent-mapped.json", JSON.stringify(mappedDataRent, null, 2));

// const notFoundRent = mappedDataRent.filter((item) => !item.addressData);

// const notFound = [...notFoundSale, ...notFoundRent];

// fs.writeFileSync("./mapped/not-found.json", JSON.stringify(notFound, null, 2));