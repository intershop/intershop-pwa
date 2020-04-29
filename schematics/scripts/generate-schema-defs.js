// @ts-check
const { resolve, extname } = require('path');
const { writeFileSync } = require('fs');

const { compileFromFile } = require('json-schema-to-typescript');
const glob = require('glob');

const log = console.log;
const rootPath = resolve(__dirname, '..');
const tsDefExtension = '.d.ts';

async function generate(filesGlob) {
  log('creating schemas');

  const schemaFiles = glob.sync(filesGlob);

  return Promise.all(
    schemaFiles.map(async (schemaFile, idx) => {
      const definitionFile = schemaFile.replace(extname(schemaFile), tsDefExtension);
      const output = await compileFromFile(schemaFile);

      const content = output.replace(new RegExp('.*any.*\n', 'g'), '');
      writeFileSync(definitionFile, content);
      return definitionFile;
    })
  );
}

generate('src/**/schema.json').then(() => {
  log('Done!');
});
