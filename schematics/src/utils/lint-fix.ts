import { Rule } from '@angular-devkit/schematics';
import { TslintFixTask } from '@angular-devkit/schematics/tasks';

/**
 * adapted from @schematics/angular/utility/lint-fix
 */
export function applyLintFix(): Rule {
  return (tree, context) => {
    // Only include files that have been touched.
    const files = tree.actions.reduce((acc: Set<string>, action) => {
      const path = action.path.substr(1); // Remove the starting '/'.
      if (path.endsWith('.ts')) {
        acc.add(path);
      }

      return acc;
    }, new Set<string>());

    // suppress warning for rules requiring type information, throw on other warnings
    console.warn = message => {
      if (!/Warning: The '.*' rule requires type information./.test(message)) {
        throw new Error(message);
      }
    };

    context.addTask(
      // tslint:disable-next-line: deprecation
      new TslintFixTask({
        ignoreErrors: true,
        silent: true,
        tsConfigPath: 'tsconfig.json',
        files: [...files],
      })
    );
  };
}
