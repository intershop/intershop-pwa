import { TestRuleExecutor } from './testRuleExecutor';

describe('UseNewAsyncInTestsRule', () => {
  let linter: TestRuleExecutor;

  beforeEach(() => {
    linter = new TestRuleExecutor('use-new-async-in-tests');
  });

  it('should not report error if using new format with TestBed.compileComponents', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      beforeEach(async () => {
        await TestBed.configureTestingModule({}).compileComponents();
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should not report error if using old format without TestBed.compileComponents', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      beforeEach(async(() => {
        TestBed.configureTestingModule({});
      }));
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  describe('with simple old format and compileComponents', () => {
    const code = `
      beforeEach(async(() => {
        TestBed.configureTestingModule({}).compileComponents();
      }));
    `;

    it('should report error if using old format with TestBed.compileComponents', () => {
      const results = linter.addSourceFile('test.spec.ts', code).lint();

      expect(results.errorCount).toBe(1);
    });

    it('should convert old format to new format when fixing', () => {
      const results = linter.addSourceFile('test.spec.ts', code).fix();

      expect(results.content).toContain('beforeEach(async () => {');
      expect(results.content).toContain('await TestBed.configureTestingModule');
    });
  });
});
