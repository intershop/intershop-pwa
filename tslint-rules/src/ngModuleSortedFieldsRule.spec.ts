import { TestRuleExecutor } from './testRuleExecutor';

describe('NgModuleSortedFieldsRule', () => {
  let linter: TestRuleExecutor;

  beforeEach(() => {
    linter = new TestRuleExecutor('ng-module-sorted-fields');
  });

  describe('in NgModule fields', () => {
    it('should not detect error when supplying sorted imports', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [A, B, C],
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should not detect error when supplying sorted imports in expanded array', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [
    A,
    B,
    C,
  ],
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should not detect error when supplying sorted imports in expanded array with complex typing', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [
    A,
    B,
    C,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
  ],
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should not detect error when supplying single element imports in expanded array with complex typing', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
  ],
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should detect error when supplying unsorted imports', () => {
      linter.addSourceFile(
        'module.ts',
        `
@NgModule({
  imports: [C, B, A],
}) export class TestModule {}`
      );
      const result = linter.lint();

      expect(result.output).toContain('list is not sorted');
    });

    it('should sort imports when fixing source file', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [C, B, A],
}) export class TestModule {}`
        )
        .fix();

      expect(result.output).toContain('Fixed 1 error');

      expect(result.content).toContain('[A, B, C]');
    });

    it('should sort imports when fixing source file with partially unsorted members', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [F, A, B, D, C, E, G],
}) export class TestModule {}`
        )
        .fix();

      expect(result.content).toContain('[A, B, C, D, E, F, G]');
    });

    it('should sort imports when fixing source file with expanded array of unsorted members', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
@NgModule({
  imports: [
    C,
    B,
    A,
  ],
}) export class TestModule {}`
        )
        .fix();

      expect(result.content).toContain(`[
    A,
    B,
    C,
  ]`);
    });

    it('should sort imports when fixing source file with expanded array of partially unsorted members', () => {
      linter.addSourceFile(
        'module.ts',
        `
@NgModule({
  imports: [
    F,
    A,
    B,
    D,
    C,
    E,
    G,
  ],
}) export class TestModule {}`
      );

      const result = linter.fix();
      expect(result.content).toContain(`[
    A,
    B,
    C,
    D,
    E,
    F,
    G,
  ]`);
    });
  });

  describe('in TestBed module', () => {
    it('should not detect error when supplying sorted entries', () => {
      const result = linter
        .addSourceFile('test.spec.ts', `TestBed.configureTestingModule({ imports: [A, B, C]});`)
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should detect error when supplying unsorted entries', () => {
      const result = linter
        .addSourceFile('test.spec.ts', `TestBed.configureTestingModule({ imports: [B, C, A]});`)
        .lint();

      expect(result.errorCount).toEqual(1);
    });

    it('should fix sorting when supplying unsorted entries', () => {
      const result = linter
        .addSourceFile('test.spec.ts', `TestBed.configureTestingModule({ imports: [B, C, A]});`)
        .fix();

      expect(result.content).toContain('[A, B, C]');
    });
  });

  describe('in NgModule arrays', () => {
    it('should not detect error when supplying sorted entries', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
const exportedComponents = [A, B, C];
@NgModule({
  exports: [...exportedComponents],
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should not detect error when supplying sorted entries in expanded array', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
const exportedComponents = [
  A,
  B,
  C,
];

@NgModule({
  exports: [...exportedComponents],
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should detect error when supplying unsorted entries', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
const exportedComponents = [C, B, A];
@NgModule({
  exports: [...exportedComponents],
}) export class TestModule {}`
        )
        .lint();

      expect(result.output).toContain('list is not sorted');
    });

    it('should sort array when supplying unsorted entries', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
const exportedComponents = [C, B, A];
@NgModule({
  exports: [...exportedComponents],
}) export class TestModule {}`
        )
        .fix();

      expect(result.content).toContain('[A, B, C]');
    });
  });

  describe('integrate into spread arrays', () => {
    it('should detect error when supplying component directly instead of into matching spread array', () => {
      linter.addSourceFile(
        'module.ts',
        `
const declaredComponents = [A, C];
@NgModule({
  declarations: [...declaredComponents, B],
}) export class TestModule {}`
      );

      const result = linter.lint();
      expect(result.errorCount).toEqual(2);
      expect(result.failures[0].fix.text).toEqual('...declaredComponents');
      expect(result.failures[1].fix.text).toEqual('A, B, C');

      const fix = linter.fix();
      expect(fix.content).not.toContain('[...declaredComponents, B]');
      expect(fix.content).toContain('[...declaredComponents]');
      expect(fix.content).toContain('[A, B, C]');
    });

    it('should detect and fix error when supplying component directly instead of into matching spread arrays', () => {
      linter.addSourceFile(
        'module.ts',
        `
const exportedComponents = [A, C];
@NgModule({
  exports: [...exportedComponents, B],
  declarations: [...exportedComponents, B],
}) export class TestModule {}`
      );

      const result = linter.lint();
      expect(result.errorCount).toEqual(3);
      expect(result.failures[0].fix.text).toEqual('...exportedComponents');
      expect(result.failures[1].fix.text).toEqual('...exportedComponents');
      expect(result.failures[2].fix.text).toEqual('A, B, C');

      const fix = linter.fix();
      expect(fix.content).not.toContain('[...exportedComponents, B]');
      expect(fix.content).toContain('[...exportedComponents]');
      expect(fix.content).toContain('[A, B, C]');
    });

    it('should detect error when supplying component directly instead of into matching spread arrays', () => {
      linter.addSourceFile(
        'module.ts',
        `
const exportedComponents = [A, C];
const declaredComponents = [D];
@NgModule({
  exports: [...exportedComponents],
  declarations: [...declaredComponents, ...exportedComponents, B],
}) export class TestModule {}`
      );

      const result = linter.lint();
      expect(result.errorCount).toEqual(2);
      expect(result.failures[0].fix.text).toEqual('...declaredComponents, ...exportedComponents');
      expect(result.failures[1].fix.text).toEqual('B, D');

      const fix = linter.fix();
      expect(fix.content).not.toContain('[...declaredComponents, ...exportedComponents, B]');
      expect(fix.content).toContain('[...declaredComponents, ...exportedComponents]');
      expect(fix.content).toContain('[A, C]');
      expect(fix.content).toContain('[B, D]');
    });

    it('should not detect error when supplying component directly instead without matching spread array', () => {
      const result = linter
        .addSourceFile(
          'module.ts',
          `
const exportedComponents = [A, C];
@NgModule({
  exports: [...exportedComponents, B],
  declarations: [...exportedComponents]
}) export class TestModule {}`
        )
        .lint();

      expect(result.errorCount).toEqual(0);
    });

    it('should add new element with correct whitespace to matching spread array', () => {
      linter.addSourceFile(
        'module.ts',
        `
const declaredComponents = [
  A,
  C,
];
@NgModule({
  declarations: [...declaredComponents, B],
}) export class TestModule {}`
      );

      const fix = linter.fix();
      expect(fix.content).not.toContain('[...declaredComponents, B]');
      expect(fix.content).toContain('[...declaredComponents]');
      expect(fix.content).toContain(`[
  A,
  B,
  C,
]`);
    });

    it('should break array when resulting element line length exceeds maximal size', () => {
      linter.addSourceFile(
        'module.ts',
        `
const declaredComponents = [AAAAAAAAAAAAAAAAAAAAAAAAAAAAA, CCCCCCCCCCCCCCCCCCCCCCCCCCC];
@NgModule({
  declarations: [...declaredComponents, BBBBBBBBBBBBBBBBBBBBBBBBB, DDDDDDDDDDDDDDDDDDDDDDD, EEEEEEEEEEEEEEEE],
}) export class TestModule {}`
      );

      const fix = linter.fix();
      expect(fix.content).not.toContain('[...declaredComponents,');
      expect(fix.content).toContain('[...declaredComponents]');
      expect(fix.content).toContain(`
const declaredComponents = [
  AAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
  BBBBBBBBBBBBBBBBBBBBBBBBB,
  CCCCCCCCCCCCCCCCCCCCCCCCCCC,
  DDDDDDDDDDDDDDDDDDDDDDD,
  EEEEEEEEEEEEEEEE,
]`);
    });
  });
});
