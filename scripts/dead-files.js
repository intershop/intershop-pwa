const _ = require('lodash');
const glob = require('glob');
const fs = require('fs');

const activeFiles = _.flatten(
  glob.sync('dist/**/active-files.json').map(activeFilesPath => {
    console.log('loading', activeFilesPath);
    return JSON.parse(fs.readFileSync(activeFilesPath, { encoding: 'utf-8' }));
  })
).filter((v, i, a) => a.indexOf(v) === i);

const filesToBeSearched = glob.sync('{src,projects}/**/!(*.spec).{ts,html,scss}');

filesToBeSearched
  .filter(file => !activeFiles.includes(file))
  .filter(file => !file.includes('/dev/') && !file.endsWith('.model.ts') && !file.endsWith('.interface.ts'))
  .forEach(file => {
    console.log(file);
  });
