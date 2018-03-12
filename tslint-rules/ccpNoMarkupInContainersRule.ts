import * as fs from 'fs';
import * as Lint from 'tslint';
import { SourceFile } from 'typescript';

const MESSAGE = 'Container templates should not contain markup.';

class CCPNoMarkupInContainersWalker extends Lint.RuleWalker {

  patterns: string[];

  constructor(sourceFile: SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    this.patterns = options['ruleArguments'][0]['patterns'];
  }

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.match(/.*\/containers\/(?!.*(routes|module|spec).ts$).*.ts/)) {

      const fileName = sourceFile.fileName;
      const templateName = fileName.substring(0, fileName.length - 2) + 'html';

      try {
        const template = fs.readFileSync(templateName, 'utf8');
        this.patterns.forEach(pattern => {
          if (template.search(pattern) >= 0) {
            const message = `${MESSAGE} (found '${pattern}')`;
            this.addFailureAtNode(sourceFile, message);
          }
        });
      } catch (err) {
        // ignored
      }
    }
  }
}

/**
 * Implementation of the ccp-no-markup-in-containers rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CCPNoMarkupInContainersWalker(sourceFile, this.getOptions()));
  }
}
