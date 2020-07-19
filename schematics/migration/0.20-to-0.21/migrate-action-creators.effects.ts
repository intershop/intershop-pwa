import { CallExpression, SourceFile, SyntaxKind } from 'ts-morph';

export class ActionCreatorsEffectMorpher {
  constructor(public effectsFile: SourceFile) {}

  migrateEffects() {
    if (!this.effectsFile) {
      return;
    }
    console.log('migrating', this.effectsFile.getFilePath());
    console.log('replacing effects...');
    this.effectsFile
      .getClasses()[0]
      .getChildrenOfKind(SyntaxKind.PropertyDeclaration)
      .filter(property => property.getFirstChildByKind(SyntaxKind.Decorator))
      .forEach(effect => {
        // retrieve information from effect
        const name = effect.getName();
        const decoratorConfig = effect.getFirstChildByKindOrThrow(SyntaxKind.Decorator).getArguments();
        let logic = effect.getInitializerIfKindOrThrow(SyntaxKind.CallExpression);

        // update effect logic
        logic = this.ensurePipeSafety(logic);
        logic = this.updateOfType(logic);

        effect.set({
          name,
          initializer:
            decoratorConfig.length > 0
              ? `createEffect(() => ${logic.getText()}, ${decoratorConfig[0].getText()})`
              : `createEffect(() => ${logic.getText()})`,
        });
        effect.getDecorators().forEach(d => d.remove());
      });
    this.effectsFile.fixMissingImports();
  }

  private ensurePipeSafety(pipe: CallExpression): CallExpression {
    const exps = pipe.getDescendantsOfKind(SyntaxKind.CallExpression);
    exps.push(pipe);
    exps
      .filter(exp => exp.getExpression().getText().includes('pipe') && exp.getArguments().length > 10)
      .forEach(pipeExp => {
        const args = pipeExp.getArguments();
        let chunks = [];
        let i = 0;
        while (i < args.length) {
          chunks.push(args.slice(i, (i += 10)));
        }
        chunks = chunks.map(chunk => chunk.map(c => c.getText()).join(', '));
        const newString = `${pipeExp.getExpression().getText()}(${chunks.join(' ).pipe( ')})`;
        pipeExp.replaceWithText(newString);
      });
    return pipe;
  }
  /**
   * updates ofType calls in given pipe
   * @param pipe pipe CallExpression
   */
  private updateOfType(pipe: CallExpression): CallExpression {
    pipe
      // get piped functions and their descendants
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter(exp => exp.getExpression().getText() === 'ofType')
      .forEach(exp => {
        if (exp) {
          // remove Type Argument and update actionType
          if (
            exp.getTypeArguments().length > 0 &&
            !exp
              .getArguments()
              .map(arg => arg.getText())
              .includes('UPDATE')
          ) {
            exp.removeTypeArgument(exp.getFirstChildByKind(SyntaxKind.TypeReference));
          }
          const args = exp.getArguments();
          args.forEach(argument => {
            if (!(argument.getText() === 'ROOT_EFFECTS_INIT' || argument.getText() === 'UPDATE')) {
              const t = argument.getLastChildByKind(SyntaxKind.Identifier) || argument;
              exp.addArgument(`${t.getText().replace(/^\w/, c => c.toLowerCase())}`);
              exp.removeArgument(argument);
            }
          });
        }
      });
    return pipe;
  }
}
