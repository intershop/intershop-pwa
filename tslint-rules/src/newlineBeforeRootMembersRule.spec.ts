import { TestRuleExecutor } from './testRuleExecutor';

describe('NewlineBeforeRootMembersRule', () => {
  let linter: TestRuleExecutor;

  beforeEach(() => {
    linter = new TestRuleExecutor('newline-before-root-members');
  });

  it('should not report errors when newlines are set properly', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
import { createAction } from '@ngrx/store';

const a = 1;
`
      )
      .lint();

    expect(result.errorCount).toBe(0);
  });

  it('should report error when newlines are missing between import and declarations', () => {
    linter.addSourceFile(
      'source.ts',
      `
import { createAction } from '@ngrx/store';
const a = 1;
`
    );
    const result = linter.lint();

    expect(result.errorCount).toBe(1);

    const fix = linter.fix();
    expect(fix.content).toMatchInlineSnapshot(`
      "
      import { createAction } from '@ngrx/store';

      const a = 1;
      "
    `);
  });

  it('should report error when newlines are missing between statements', () => {
    linter.addSourceFile(
      'source.ts',
      `
import { createAction } from '@ngrx/store';

const a = 1;
const b = 2;
`
    );
    const result = linter.lint();

    expect(result.errorCount).toBe(1);

    const fix = linter.fix();
    expect(fix.content).toMatchInlineSnapshot(`
      "
      import { createAction } from '@ngrx/store';

      const a = 1;

      const b = 2;
      "
    `);
  });

  it('should respect comments when fixing newlines', () => {
    linter.addSourceFile(
      'source.ts',
      `
import { createAction } from '@ngrx/store';
/**
 * comment
 */
const a = 1;
const b = 2;
// comment
const c = 3;
`
    );
    const result = linter.lint();

    expect(result.errorCount).toBe(3);

    const fix = linter.fix();
    expect(fix.content).toMatchInlineSnapshot(`
      "
      import { createAction } from '@ngrx/store';

      /**
       * comment
       */
      const a = 1;

      const b = 2;

      // comment
      const c = 3;
      "
    `);
  });
});
