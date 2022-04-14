import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { PWAEslintRuleOptionsSchema as Options } from 'schemas/eslint-rule/schema';

import { createApplication, createSchematicRunner } from '../utils/testHelper';

describe('eslint-rule', () => {
  const schematicRunner = createSchematicRunner();
  const defaultOptions: Options = {
    name: 'foo-bar',
  };

  let appTree: UnitTestTree;
  beforeEach(async () => {
    const appTree$ = createApplication(schematicRunner);
    appTree = await appTree$.toPromise();
  });

  it('should create a rule and add it to index.ts', async () => {
    const tree = await schematicRunner.runSchematicAsync('eslint-rule', defaultOptions, appTree).toPromise();
    const files = tree.files.filter(x => x.search('rules') >= 0);
    expect(files).toContain('/eslint-rules/src/rules/foo-bar.ts');
  });
});
