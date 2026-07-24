import { Rule, SchematicsException, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { StandaloneOverrideFlagMigration as Options } from 'schemas/migrations/standalone-override-flag/schema';
import { Node, ObjectLiteralExpression, PropertyAssignment, SourceFile } from 'ts-morph';

import { applyLintFix } from '../../utils/lint-fix';
import { logMigrationStart } from '../../utils/log-migration';
import { createTsMorphProject } from '../../utils/ts-morph';

const ARTIFACT_DECORATORS = ['Component', 'Directive', 'Pipe'];

// Matches theme override files like `foo.component.brand.ts`, `foo.directive.brand.ts`, `foo.pipe.brand.ts`.
// The single theme segment must not contain a dot, and spec files are excluded by the file extension check below.
const OVERRIDE_FILE_REGEX = /\.(component|directive|pipe)\.[^.]+\.ts$/;

/**
 * Returns the object literal of the first Component/Directive/Pipe decorator found in the file, if any.
 */
function getArtifactDecoratorArgument(sourceFile: SourceFile): ObjectLiteralExpression | undefined {
  for (const declaration of sourceFile.getClasses()) {
    for (const decorator of declaration.getDecorators()) {
      if (ARTIFACT_DECORATORS.includes(decorator.getName())) {
        const argument = decorator.getArguments()[0];
        return argument && Node.isObjectLiteralExpression(argument) ? argument : undefined;
      }
    }
  }
  return;
}

/**
 * Returns the `standalone` initializer text (`'true'` / `'false'`) or `undefined` if the key is absent.
 */
function getStandaloneValue(objectLiteral: ObjectLiteralExpression): string | undefined {
  const property = objectLiteral
    .getProperties()
    .find((prop): prop is PropertyAssignment => Node.isPropertyAssignment(prop) && prop.getName() === 'standalone');
  return property?.getInitializer()?.getText();
}

/**
 * Sets the `standalone` key to the given value, inserting it after `selector`/`name` to comply with the
 * `@angular-eslint/sort-keys-in-type-decorator` order, or removes it when the base has no `standalone` key.
 */
function applyStandaloneValue(objectLiteral: ObjectLiteralExpression, value: string | undefined): void {
  const existing = objectLiteral
    .getProperties()
    .find((prop): prop is PropertyAssignment => Node.isPropertyAssignment(prop) && prop.getName() === 'standalone');

  if (value === undefined) {
    existing?.remove();
    return;
  }

  if (existing) {
    existing.setInitializer(value);
    return;
  }

  const properties = objectLiteral.getProperties();
  const anchorIndex = properties.findIndex(
    prop => Node.isPropertyAssignment(prop) && ['selector', 'name'].includes(prop.getName())
  );
  objectLiteral.insertPropertyAssignment(anchorIndex + 1, { name: 'standalone', initializer: value });
}

/**
 * Synchronizes the `standalone` flag of theme override artifacts with their related standard (base) artifact.
 *
 * Theme override files (e.g. `foo.component.brand.ts`) are swapped in at build time via `fileReplacements` and
 * are therefore not part of the default TypeScript program - so they are skipped by the official Angular
 * `explicit-standalone-flag` migration. This migration closes that gap by copying the `standalone` state
 * (`false`, `true`, or "no key") from each base artifact onto its overrides.
 */
export function migrateStandaloneOverrideFlag(options: Options): Rule {
  return chain([
    logMigrationStart('standalone-override-flag'),
    async host => {
      const workspace = await getWorkspace(host);

      const projects = options.project ? [workspace.projects.get(options.project)] : [...workspace.projects.values()];
      if (options.project && !projects[0]) {
        throw new SchematicsException(`Project "${options.project}" not found.`);
      }

      const tsProject = createTsMorphProject(host);
      const loadSourceFile = (filePath: string) =>
        tsProject.getSourceFile(filePath) ?? tsProject.addSourceFileAtPath(filePath);

      const sourceRoots = new Set(projects.map(project => project.sourceRoot ?? project.root).filter(Boolean));

      for (const sourceRoot of sourceRoots) {
        host.getDir(`/${sourceRoot}`).visit(filePath => {
          if (!OVERRIDE_FILE_REGEX.test(filePath)) {
            return;
          }

          const overrideSource = loadSourceFile(filePath);
          const overrideDecorator = getArtifactDecoratorArgument(overrideSource);
          if (!overrideDecorator) {
            return;
          }

          const basePath = filePath.replace(OVERRIDE_FILE_REGEX, '.$1.ts');
          if (!host.exists(basePath)) {
            return;
          }

          const baseDecorator = getArtifactDecoratorArgument(loadSourceFile(basePath));
          if (!baseDecorator) {
            return;
          }

          const baseValue = getStandaloneValue(baseDecorator);
          if (baseValue === getStandaloneValue(overrideDecorator)) {
            return;
          }

          applyStandaloneValue(overrideDecorator, baseValue);

          if (host.read(filePath)?.toString() !== overrideSource.getFullText()) {
            host.overwrite(filePath, overrideSource.getFullText());
          }
        });
      }
    },
    applyLintFix(),
  ]);
}
