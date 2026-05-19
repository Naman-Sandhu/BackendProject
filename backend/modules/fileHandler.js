const fs = require('fs');
const path = require('path');

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '..', filePath),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
};

const appendFile = (filePath, data) => {
  try {
    const existingData = readFile(filePath);
    existingData.push(data);
    writeFile(filePath, existingData);
    return true;
  } catch (error) {
    throw new Error(`Error appending to file: ${error.message}`);
  }
};

module.exports = { readFile, writeFile, appendFile };
