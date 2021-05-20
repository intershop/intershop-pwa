const xliff = require('xliff');
const fs = require('fs');
const path = require('path');

console.log('converting');

const translationFilesPath = 'src/assets/i18n';
const targetFilePath = 'src/assets/xliff';

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
  const prefixedFile = {};
  Object.keys(file).forEach(key => {
    prefixedFile[`pwa-${key}`] = file[key];
  });
  xliff.createxliff(defaultLang, fileName, prefixedDefaultFile, prefixedFile, 'namespace1', (err, res) => {
    if (err) {
      console.log(err);
    }
    conversions[fileName.replace('.json', '.xliff')] = res;
  });
}

Object.keys(conversions).forEach(key => {
  fs.writeFileSync(path.join(targetFilePath, key), conversions[key]);
});
