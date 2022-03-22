import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import glob from 'glob';
import { compileFromFile } from 'json-schema-to-typescript';

const schemaFiles = glob.sync('src/**/schema.json').map(file => ({
  input: file,
  output: file.replace(/\.json$/, '.d.ts'),
}));

for (const schemaFile of schemaFiles) {
  const output = await compileFromFile(schemaFile.input);

  const content = output.replace('[k: string]: unknown;', '').replace('/* tslint:disable */', '');

  writeFileSync(schemaFile.output, content);
}

execSync('npx eslint --fix ' + schemaFiles.map(f => f.output).join(' '));
