import { TestRuleExecutor } from './testRuleExecutor';

describe('ForceJsdocCommentsRule', () => {
  let linter: TestRuleExecutor;

  beforeEach(() => {
    linter = new TestRuleExecutor('force-jsdoc-comments');
  });

  it('should not report error if no comments on local fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error if no comments on exported fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should report error for single line comments on exported constants', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some comment
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
  });

  it('should not report error for single line comment on unrelated to exported constants', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some dead code

export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error for single line comments on unrelated to exported constants', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some
// dead
// code

export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error if comments on local fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some comment
const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error if dead-code supression', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// not-dead-code
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error if comments on local function', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some comment
function a() {}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should report error for single line comments on exported functions', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some comment
export function a() {}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
  });

  it('should report error for single line comments on exported classes', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some comment
export class A {}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
  });

  it('should report error for single line comments on exported classes with decorator', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
// some comment
@Component()
export class A {}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
  });

  it('should report error for single line comments on exported classes between decorator and class', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
@Component()
// some comment
export class A {}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
    expect(result.failures[0].failure).toEqual('This comment should be moved above the decorator.');
  });

  it('should report error for single multi line comments on exported fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
/* some comment */
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
  });

  it('should report error for multi line comments on exported fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
/*
 * some comment
 */
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
    expect(result.failures[0].failure).toEqual(
      'This comment should be a JSDoc comment or it should be moved further away.'
    );
  });

  it('should not report error for JSDoc comments on fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
/**
 * some comment
 */
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error for single line JSDoc comments on exported fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
/** some comment */
export const a = 1;
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should report error for single line comments on class fields with decorator', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {

  // some comment
  @Effect()
  do$ = this.actions.pipe();
}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
  });

  it('should report error for multi line comments on class fields with decorator', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {

  /*
   * some comment
   */
  @Effect()
  do$ = this.actions.pipe();
}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
    expect(result.failures[0].failure).toEqual(
      'This comment should be a JSDoc comment or it should be moved further away.'
    );
  });

  it('should report error for single line comments on class fields between decorator', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {

  @Effect()
  // some comment
  do$ = this.actions.pipe();
}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
    expect(result.failures[0].failure).toEqual('This comment should be moved above the decorator.');
  });

  it('should report error for any multi line comments on class fields between decorator', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {

  @Effect()
  /**
   * some comment
   */
  do$ = this.actions.pipe();
}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(1);
    expect(result.failures[0].token).toContain('some comment');
    expect(result.failures[0].failure).toEqual('This comment should be moved above the decorator.');
  });

  it('should not report error for JSDoc comments on class fieldswhen decorator is on the same line', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {

  /**
   * some comment
   */
  @Input() a: number;
}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should not report error for unrelated single line comments on class fields', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {

  // some comment

  do() {};
}
      `
      )
      .lint();

    expect(result.errorCount).toEqual(0);
  });

  it('should fix JSDoc comment on same line as declaration', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
/**
 * some documentation
 */ export class A {
}
      `
      )
      .fix();

    expect(result.errorCount).toEqual(0);
    expect(result.content.split('\n')).toContain('export class A {');
  });

  it('should fix JSDoc comment on same line as declaration respecting decorators', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
/**
 * some documentation
 */ @Component()
export class A {
}
      `
      )
      .fix();

    expect(result.errorCount).toEqual(0);
    expect(result.content.split('\n')).toContain('@Component()');
  });

  it('should fix JSDoc comment on same line as declaration within classes', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {
  /**
   * some documentation
   */ field = ...
}
      `
      )
      .fix();

    expect(result.errorCount).toEqual(0);
    expect(result.content.split('\n')).toContain('  field = ...');
  });

  it('should fix JSDoc comment on same line as declaration within classes respecting decorators', () => {
    const result = linter
      .addSourceFile(
        'source.ts',
        `
export class A {
  /**
   * some documentation
   */ @Input() field = ...
}
      `
      )
      .fix();

    expect(result.errorCount).toEqual(0);
    expect(result.content.split('\n')).toContain('  @Input() field = ...');
  });
});
