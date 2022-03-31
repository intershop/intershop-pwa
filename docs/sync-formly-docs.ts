import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { kebabCase } from 'lodash';

const folder = 'src/app/shared/formly/field-library';

// extract all provided configurations from module
const moduleContent = readFileSync(`${folder}/field-library.module.ts`, {
  encoding: 'utf-8',
});

/**
 *  EXTRACT FIELD CONFIGURATION OBJECTS
 **/
// map to corresponding files
const configs = moduleContent.match(
  /(?<={ provide: FIELD_LIBRARY_CONFIGURATION, useClass: )(.+)(?=Configuration, multi: true })/gm
);

// map configurations to file paths
const files = configs.map(config => `${folder}/configurations/${kebabCase(config.toString())}.configuration.ts`);

/**
 * EXTRACT FIELD CONFIGURATION GROUP OBJECTS
 **/
const configurationGroups = moduleContent.match(
  /(?<=\s*{\s*provide: FIELD_LIBRARY_CONFIGURATION_GROUP,\s*useValue: )({[^}]*})(?=,\s*multi: true,\s*})/gm
);

/**
 * READ DOCUMENTATION FILE AND REPLACE TABLE CONTENTS
 **/
const documentationFilePath = 'docs/guides/field-library.md';

const documentationContent = readFileSync(documentationFilePath, {
  encoding: 'utf-8',
});

const syncPattern = /<!-- sync-start -->([\s\S]*)<!-- sync-end -->/gm;

if (!documentationContent.match(syncPattern)) {
  console.error("Can't find synchronization comments. Did you manually edit field-library.md?");
}

const updatedDocumentationContent = documentationContent.replace(
  syncPattern,
  `<!-- sync-start -->
   ${getTableContentsConfigurations()}

   ${getTableContentsConfigurationGroups()}

   <!-- sync-end -->`
);

writeFileSync(documentationFilePath, updatedDocumentationContent);

// only run formatting if not executed in ci context
if (!(process.argv[2] === '--ci')) {
  execSync('npm run format');
}

// helper methods

function getTableContentsConfigurations(): string {
  // get information from files
  const [ids, types, descriptions] = extractFileInformation(files);

  const tableRows = configs.map((_, idx) => [ids[idx], types[idx], descriptions[idx]]);

  return `
| Configuration ID | Type | Description |
| ------------- | ----- | ----------- |${tableRows
    .map(row => `| ${row[0]} | ${row[1]} | ${row[2]} |`)
    .reduce((acc, curr) => `${acc} \n ${curr}`, '')}
`;
}

function extractFileInformation(files: string[]): string[][] {
  const ids: string[] = [];
  const types: string[] = [];
  const descriptions: string[] = [];
  files.forEach(filePath => {
    const fileContent = readFileSync(filePath, {
      encoding: 'utf-8',
    });
    ids.push(extractId(fileContent));
    types.push(extractType(fileContent));
    descriptions.push(extractDescription(fileContent));
  });
  return [ids, types, descriptions];
}

function extractId(fileContent: string) {
  const id = fileContent.match(/id = '(.+)';/)?.[1] ?? '?';
  return `\`${id}\``;
}

function extractType(fileContent: string) {
  return fileContent.match(/type: '(.+)'/)?.[1] ?? '?';
}

function extractDescription(fileContent: string) {
  // regex to match first comment
  let docComment = fileContent.match(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm)?.[0] ?? '';
  // regex to remove comment markers and just have text
  docComment = docComment.replace(/^\/\*\*|^\s*\*\/*|^\/\//gm, '').trim();
  // replace newlines with <br/> to enable multiline descriptions in gh flavoured markdown
  docComment = docComment.replace('\n', '<br/>');
  return docComment;
}

function getTableContentsConfigurationGroups(): string {
  const tableRows = configurationGroups.map(
    (groupStr: string) => `| ${extractGroupId(groupStr)} | ${extractGroupShortcutFor(groupStr)} |`
  );

  return `
  | ConfigurationGroup ID | ShortcutFor Types |
  | ---------- | ---------- |${tableRows.reduce((acc, curr) => `${acc} \n ${curr}`, '')}`;
}

function extractGroupId(content: string) {
  const id = content.match(/(?<=id: ')(\S*)(?=')/)?.[1] ?? '?';
  return `\`${id}\``;
}

function extractGroupShortcutFor(content: string) {
  const shortcutFor = content.match(/(?<=shortcutFor: \[)([^\]]*?)(?=\])/)?.[1] ?? '?';
  return `\`${shortcutFor}\``;
}
