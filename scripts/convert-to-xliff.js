const xliff = require('xliff');
const fs = require('fs');
const path = require('path');

console.log('converting');

const translationFilesPath = 'src/assets/i18n';
const targetFilePath = 'src/assets/xliff';

// read default lang file for "source" tags
const defaultLang = 'en_US';
const defaultFile = JSON.parse(fs.readFileSync(path.join(translationFilesPath, defaultLang + '.json')));
const prefixedDefaultFile = {};
Object.keys(defaultFile).forEach(key => {
  prefixedDefaultFile[`pwa-${key}`] = defaultFile[key];
});

const fileNames = fs.readdirSync(translationFilesPath);
const conversions = {};

for (fileName of fileNames) {
  console.log(fileName);
  var file = JSON.parse(fs.readFileSync(path.join(translationFilesPath, fileName), { encoding: 'utf8' }));

  // prefix keys for easy identification
  const prefixedFile = {};
  Object.keys(file).forEach(key => {
    prefixedFile[`pwa-${key}`] = file[key];
  });

  // make sure objects are stringified
  for (let key in prefixedFile) {
    value = prefixedFile[key];
    if (typeof value !== 'string') {
      prefixedFile[key] = JSON.stringify(value);
    }
  }
  xliff.createxliff12(defaultLang, fileName, prefixedDefaultFile, prefixedFile, 'namespace1', (err, res) => {
    if (err) {
      console.log(err);
    }
    conversions[fileName.replace('.json', '.xliff')] = res;
  });
}

Object.keys(conversions).forEach(key => {
  fs.writeFileSync(path.join(targetFilePath, key), conversions[key]);
});
