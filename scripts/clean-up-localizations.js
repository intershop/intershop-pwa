const _ = require('lodash');
const fs = require('fs');
const glob = require('glob');
const { execSync } = require('child_process');

const localizationFile_default = 'src/assets/i18n/en_US.json';

// regular expression for patterns of not explicitly used localization keys (dynamic created keys, error keys from REST calls)
// ADDITIONAL PATTERNS HAVE TO BE ADDED HERE
const regEx = /account\.login\..*\.message|.*budget.period..*|account\.budget\.type\..*|.*\.error.*/i;

// store localizations from default localization file in an object
const localizations_default = JSON.parse(fs.readFileSync(localizationFile_default, 'utf8'));
console.log('Clean up file', localizationFile_default, 'as default localization file');

// add not explicitly used localization keys with their localization values
const localizationsFound = {};
Object.keys(localizations_default)
  .filter(localization => regEx.test(localization))
  .map(localizationKey => {
    localizationsFound[localizationKey] = localizations_default[localizationKey];
    delete localizations_default[localizationKey];
  });

// go through directory recursively and find files to be searched
const filesToBeSearched = glob.sync('{src,projects}/**/!(*.spec).{ts,html}');

// add used localization keys with their localization values
filesToBeSearched.forEach(filePath => {
  const fileContent = fs.readFileSync(filePath);
  for (const localizationKey in localizations_default) {
    if (fileContent.includes(localizationKey)) {
      // store found localizations
      localizationsFound[localizationKey] = localizations_default[localizationKey];
      delete localizations_default[localizationKey];
    }
  }
});

// log removed localization keys
Object.keys(localizations_default).forEach(localizationKey => {
  console.log('\x1b[31m%s\x1b[0m', `  Localization key ${localizationKey} removed because it is not used`);
});

// sort found localizations
const localizationsFoundOrdered = {};
Object.keys(localizationsFound)
  .sort()
  .forEach(key => {
    localizationsFoundOrdered[key] = localizationsFound[key];
  });

// write found localizations into default localization file
fs.writeFileSync(localizationFile_default, JSON.stringify(localizationsFoundOrdered, null, 2));

// find localization files for other languages
const localizationFiles_lang = glob
  .sync('src/assets/i18n/*.json')
  .filter(filePath => filePath !== localizationFile_default);

// create cleaned localization files for other languages
localizationFiles_lang.forEach(file => {
  console.log('\nClean up file', file);
  const localizations_lang = JSON.parse(fs.readFileSync(file, 'utf8'));
  // find missing localization keys
  _.difference(Object.keys(localizationsFoundOrdered), Object.keys(localizations_lang)).forEach(key => {
    console.log('\x1b[33m%s\x1b[0m', `  Localization key ${key} not found in ${file}`);
  });
  fs.writeFileSync(file, JSON.stringify(_.pick(localizations_lang, Object.keys(localizationsFoundOrdered)), null, 2));
});

// run prettier to fix any formatting or line and file ending inconsistencies
execSync('npx prettier --write src/assets/i18n/*.*');
