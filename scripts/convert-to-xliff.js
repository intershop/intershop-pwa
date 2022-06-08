const xliff = require('xliff');
const fs = require('fs');
const path = require('path');
const translationFilesPath = 'src/assets/i18n';
const targetFilePath = 'src/assets/xliff';

console.log(`Converting to ${targetFilePath}`);

// read default lang file for "source" tags
const defaultLang = 'en_US';
const defaultFile = JSON.parse(fs.readFileSync(path.join(translationFilesPath, defaultLang + '.json')));
const prefixedDefaultFile = {};
Object.keys(defaultFile).forEach(key => {
  prefixedDefaultFile[`pwa-${key}`] = defaultFile[key];
});

const fileNames = fs.readdirSync(translationFilesPath);
const conversions = {};

for (let fileName of fileNames) {
  console.log(fileName);
  var file = JSON.parse(fs.readFileSync(path.join(translationFilesPath, fileName), { encoding: 'utf8' }));

  // prefix keys for easy identification
  const prefixedFile = {};
  Object.keys(file).forEach(key => {
    prefixedFile[`pwa-${key}`] = file[key];
  });

  // make sure objects are stringified
  for (let key in prefixedFile) {
    const value = prefixedFile[key];
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

try {
  fs.accessSync(targetFilePath, fs.constants.F_OK);
} catch (error) {
  if (error?.code === 'EACCES') {
    console.error(`No access to ${targetFilePath}`);
  } else {
    fs.mkdirSync(targetFilePath);
  }
}

if (fs.existsSync(targetFilePath)) {
  Object.keys(conversions).forEach(key => {
    fs.writeFile(path.join(targetFilePath, key), conversions[key], err => {
      if (err) throw err;
      console.log(`Wrote ${key}`);
    });
  });
}
