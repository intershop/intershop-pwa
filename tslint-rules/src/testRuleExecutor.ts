import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as rimraf from 'rimraf';
import { IOptions, Linter, Replacement } from 'tslint';
import * as ts from 'typescript';

export class TestRuleExecutor {
  private tmpDir: string;
  private sourcePath: string;
  private ruleConfig: Partial<IOptions> = { ruleSeverity: 'error' };

  constructor(private ruleName: string) {
    this.tmpDir = join(process.cwd(), 'test', ruleName);
    if (existsSync(this.tmpDir)) {
      rimraf.sync(this.tmpDir);
    }
    mkdirSync(this.tmpDir, { recursive: true });
    // write empty tslint.json so project linting does not check temporary test files
    writeFileSync(join(process.cwd(), 'test', 'tslint.json'), '{}');

    mkdirSync(this.rulesDirectory);
    writeFileSync(join(this.rulesDirectory, 'index.js'), "exports.rulesDirectory = '.';", { encoding: 'utf-8' });

    const camelized = ruleName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    this.transpileSource(camelized + 'Rule');
    this.transpileSource('ruleHelpers');
  }

  get rulesDirectory() {
    return join(this.tmpDir, 'rules');
  }

  private transpileSource(name: string) {
    const rulePath = join(process.cwd(), 'src', name + '.ts');
    const ruleSource = readFileSync(rulePath, { encoding: 'utf-8' });
    const transpiled = ts.transpileModule(ruleSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
      .outputText;
    writeFileSync(join(this.rulesDirectory, name + '.js'), transpiled, { encoding: 'utf-8' });
  }

  addSourceFile(path: string, source: string) {
    this.sourcePath = join(this.tmpDir, path);
    writeFileSync(this.sourcePath, source, { encoding: 'utf-8' });
    return this;
  }

  // tslint:disable-next-line: no-any
  setRuleConfig(ruleConfig: any) {
    this.ruleConfig = { ruleSeverity: 'error', ruleArguments: [ruleConfig] };
    return this;
  }

  private readSource() {
    return readFileSync(this.sourcePath, { encoding: 'utf-8' });
  }

  // tslint:disable-next-line: no-any
  private run(fix: boolean) {
    const lintOptions = {
      fix,
      formatter: 'prose',
    };

    const linter = new Linter(lintOptions);
    linter.lint(this.sourcePath, this.readSource(), {
      rules: new Map().set(this.ruleName, this.ruleConfig),
      rulesDirectory: [this.rulesDirectory],
      jsRules: new Map(),
      extends: [],
    });

    return linter.getResult();
  }

  // tslint:disable-next-line: no-any
  lint() {
    const result = this.run(false);

    return {
      output: result.output.replace(new RegExp(this.sourcePath, 'g'), '').trim().replace(/ in$/, ''),
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      failures:
        result.failures &&
        result.failures.map(f => ({
          failure: f.getFailure(),
          fix: Array.isArray(f.getFix()) ? (f.getFix()[0] as Replacement) : (f.getFix() as Replacement),
          start: { ...f.getStartPosition().getLineAndCharacter(), position: f.getStartPosition().getPosition() },
          end: { ...f.getEndPosition().getLineAndCharacter(), position: f.getEndPosition().getPosition() },
          token: f.getRawLines().substring(f.getStartPosition().getPosition(), f.getEndPosition().getPosition()),
        })),
    };
  }

  // tslint:disable-next-line: no-any
  fix() {
    const result = this.run(true);

    return {
      content: this.readSource(),
      output: result.output.replace(new RegExp(this.sourcePath, 'g'), '').trim().replace(/ in$/, ''),
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      fixes: result.fixes && result.fixes.map(f => ({ failure: f.getFailure() })),
      failures:
        result.failures &&
        result.failures.map(f => ({
          failure: f.getFailure(),
          fix: Array.isArray(f.getFix()) ? (f.getFix()[0] as Replacement) : (f.getFix() as Replacement),
        })),
    };
  }
}
