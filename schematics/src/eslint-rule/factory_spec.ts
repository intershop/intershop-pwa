import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { lastValueFrom } from 'rxjs';

import { copyFileFromPWA, createApplication, createSchematicRunner } from '../utils/testHelper';

import { PWAEslintRuleOptionsSchema as Options } from './schema';

describe('eslint-rule', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo-bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner).pipe(copyFileFromPWA('eslint-rules/src/index.ts'));
    appTree = await lastValueFrom(appTree$);
  });
  it('should create a rule and add it to index.ts', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('eslint-rule', options, appTree).toPromise();
    const files = tree.files.filter(x => x.search('rules') >= 0);
    expect(files).toContain('/eslint-rules/src/rules/foo-bar.ts');

    expect(tree.readContent('/eslint-rules/src/index.ts')).toContain("'foo-bar': fooBarRule");
  });
});
