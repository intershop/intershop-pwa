import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import glob from 'glob';
import { compileFromFile } from 'json-schema-to-typescript';

const schemaFiles = glob.sync('src/**/schema.json').map(file => ({
  input: file,
  output: file.replace(/\.json$/, '.d.ts'),
}));

await Promise.all(
  schemaFiles.map(async schemaFile => {
    const output = await compileFromFile(schemaFile.input, {
      unknownAny: true,
      bannerComment: `/*
  THIS FILE IS GENERATED!
  update it by running 'npm run build:schematics'
*/`,
    });

    writeFileSync(schemaFile.output, output);
  })
);

execSync('npx eslint --fix ' + schemaFiles.map(f => f.output).join(' '));
