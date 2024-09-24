const rentData = require('./mapped/for-rent-minified.json');

const map = new Map();

const getCoordinateString = ([lat, lon]) => `${lat}-${lon}`;

rentData.forEach((item) => {
    const { cors } = item;
    const coordinateString = getCoordinateString(cors);

    if (!map.has(coordinateString)) {
        map.set(coordinateString, []);
    }

    map.get(coordinateString).push(item);
});