/* eslint-disable no-console */
const fs = require('fs');
const decompress = require('decompress');
const yaml = require('yaml');
// const { MongoClient } = require('mongodb');

// Connection URL for MongoDB

async function extractAndInsertData(zipFilePath) {
	try {
		// Create a directory to extract the files
		const extractDir = './extracted-files';

		if (!fs.existsSync(extractDir)) {
			fs.mkdirSync(extractDir);
		}

		// Extract the zip file
		decompress(zipFilePath, 'extracted-files').then(files => {
			console.log('done!');
		});

		// Read the extracted files
		const files = fs.readdirSync(extractDir);

		// Process each YAML file
		const data = [];

		for (const file of files) {
			if (file.endsWith('.yml')) {
				const filePath = `${extractDir}/${file}`;
				const fileContent = fs.readFileSync(filePath, 'utf8');
				const yamlData = yaml.parse(fileContent);
				data.push(yamlData);
			}
		}

		// Insert the data into the database
		// await insertDataIntoDatabase(data);

		// Clean up: remove the extracted files directory
		// fs.rmdirSync(extractDir, { recursive: true });

		console.log('Extraction and insertion completed successfully!');
	} catch (err) {
		console.error('Error extracting and inserting data:', err);
	}
}

// Usage
const zipFilePath = 'temp/nlu.zip';
extractAndInsertData(zipFilePath);

