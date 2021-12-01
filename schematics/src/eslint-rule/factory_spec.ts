import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createSchematicRunner, createApplication, copyFileFromPWA } from '../utils/testHelper';
import { PWAEslintRuleOptionsSchema as Options } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('eslint-rule', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo-bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createApplication(schematicRunner).pipe(copyFileFromPWA('eslint-rules/src/index.ts')).toPromise();
  });
  it('should create a rule and add it to index.ts', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('eslint-rule', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('rules') >= 0);
    expect(files).toContain('/eslint-rules/src/rules/foo-bar.ts');

    expect(tree.readContent('/eslint-rules/src/index.ts')).toContain("'foo-bar': fooBarRule");
  });
});
