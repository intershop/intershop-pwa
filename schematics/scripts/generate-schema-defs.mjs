import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import { compileFromFile } from 'json-schema-to-typescript';
import { dirname, join, normalize } from 'path';

const findProjectRoot = () => {
  let projectRoot = normalize(process.cwd());

  while (!existsSync(join(projectRoot, 'angular.json'))) {
    if (dirname(projectRoot) === projectRoot) {
      throw new Error('cannot determine project root');
    }
    projectRoot = dirname(projectRoot);
  }
  return projectRoot;
};

const prettierConfigPath = join(findProjectRoot(), '.prettierrc.json');
let formatting;
if (existsSync(prettierConfigPath)) {
  const prettierConfig = JSON.parse(readFileSync(prettierConfigPath));
  formatting = {
    style: {
      ...prettierConfig,
      parser: 'typescript',
    },
  };
} else {
  formatting = {
    format: false,
  };
}

Promise.all(
  glob.sync('src/**/schema.json').map(async schemaFile => {
    const output = await compileFromFile(schemaFile, {
      ...formatting,
      unknownAny: true,
      bannerComment: `/*
  THIS FILE IS GENERATED!
  update it by running 'npm run build:schematics'
*/`,
    });

    const target = schemaFile.replace(/^src/, 'dist').replace(/\.json$/, '.d.ts');

    if (!existsSync(dirname(target))) {
      mkdirSync(dirname(target), { recursive: true });
    }

    writeFileSync(target, output);
  })
);
