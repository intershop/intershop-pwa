import { TestRuleExecutor } from './testRuleExecutor';

describe('UseAsyncSynchronizationInTestsRule', () => {
  let linter: TestRuleExecutor;

  beforeEach(() => {
    linter = new TestRuleExecutor('use-async-synchronization-in-tests');
  });

  it('should report error if done callback is missing', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', () => {
        obs$.subscribe(() => {
          something();
        });
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(1);
  });

  it('should allow done callback if called explicitly', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', done => {
        obs$.subscribe(() => {
          done();
        });
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should allow done callback for block', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', done => {
        obs$.subscribe(noop, noop, done);
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should allow done callback for partial subscriber', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', done => {
        obs$.subscribe({ complete: done });
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should allow subscribe without done callback for fakeAsync blocks', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', fakeAsync(() => {
        obs$.subscribe(noop, noop, noop);

        tick(500);
      }));
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should allow done callback if called with setTimeout as block', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', done => {
        obs$.subscribe(noop, noop, noop);

        setTimeout(done, 2000);
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should allow done callback if called with setTimeout explicitly', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', done => {
        obs$.subscribe(noop, noop, noop);

        setTimeout({
          something();
          done();
        }, 2000);
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });

  it('should allow done callback if called explicitly', () => {
    const results = linter
      .addSourceFile(
        'test.spec.ts',
        `
      it('should ', done => {
        obs$.subscribe(noop, noop, noop);

        done();
      });
    `
      )
      .lint();

    expect(results.errorCount).toBe(0);
  });
});
