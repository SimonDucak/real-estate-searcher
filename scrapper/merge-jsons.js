const fs = require('fs');
const path = require('path');

// Directory path where JSON files are stored
const directoryPath = path.join(__dirname, 'for-rent');

// Array to store merged data
let mergedData = [];

// Function to merge all JSON files in the folder
const mergeJsonFiles = (directory) => {
    // Read all the files in the directory
    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.error(`Unable to scan directory: ${err}`);
        }

        // Filter files to include only JSON files (assuming the files are named 'page-x.json')
        files = files.filter(file => file.startsWith('page-') && file.endsWith('.json'));

        // Loop through each file and merge its content into one big array
        files.forEach((file, index) => {
            const filePath = path.join(directory, file);

            // Read the JSON file
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return console.error(`Error reading file ${file}: ${err}`);
                }

                try {
                    // Parse and concatenate the JSON content (which is expected to be an array)
                    const jsonData = JSON.parse(data);
                    if (Array.isArray(jsonData)) {
                        mergedData = mergedData.concat(jsonData);
                    } else {
                        console.error(`File ${file} does not contain an array`);
                    }
                } catch (e) {
                    console.error(`Error parsing JSON in file ${file}: ${e}`);
                }

                // Check if all files have been processed
                if (index === files.length - 1) {
                    // Save the merged result to a new JSON file
                    const outputFilePath = path.join(__dirname, 'mergedDataArray.json');
                    fs.writeFile(outputFilePath, JSON.stringify(mergedData, null, 2), (err) => {
                        if (err) {
                            return console.error(`Error writing merged data: ${err}`);
                        }
                        console.log(`Merged JSON array saved to ${outputFilePath}`);
                    });
                }
            });
        });
    });
};

// Execute the function
mergeJsonFiles(directoryPath);