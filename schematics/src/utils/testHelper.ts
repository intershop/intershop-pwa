import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ModuleOptions } from '@schematics/angular/module/schema';
import { readFileSync } from 'fs';
import { Observable, OperatorFunction, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export function createSchematicRunner() {
  return new SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
}

export function createApplication(schematicRunner: SchematicTestRunner) {
  return from(
    schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '6.0.0',
    })
  ).pipe(
    switchMap(workspace =>
      from(
        schematicRunner.runExternalSchematic(
          '@schematics/angular',
          'application',
          {
            name: 'bar',
            inlineStyle: false,
            inlineTemplate: false,
            routing: true,
            style: 'scss',
            skipTests: false,
            skipPackageJson: false,
            prefix: 'ish',
            projectRoot: '',
            standalone: false, // Force module-based architecture
          },
          workspace
        )
      ).pipe(normalizeToClassicNaming(), copyFileFromPWA('src/environments/environment.model.ts'))
    )
  );
}

/**
 * Angular 20's `@schematics/angular` application schematic generates files using the new
 * naming convention (`app-module.ts`, `app.ts` with class `App`, `app.html`, `app-routing-module.ts`).
 * The Intershop PWA and its schematics still use the classic naming (`app.module.ts`,
 * `app.component.ts` with class `AppComponent`, `app.component.html`, `app-routing.module.ts`).
 * This operator renames the generated files back to the classic naming so the scaffolded
 * test application matches the structure the PWA schematics target.
 */
function normalizeToClassicNaming(): OperatorFunction<UnitTestTree, UnitTestTree> {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(
      map(tree => {
        const rename = (fromPath: string, toPath: string, transform?: (content: string) => string) => {
          if (tree.exists(fromPath)) {
            const content = tree.readContent(fromPath);
            tree.delete(fromPath);
            tree.create(toPath, transform ? transform(content) : content);
          }
        };

        // app component: app.ts (class App) -> app.component.ts (class AppComponent)
        rename('/src/app/app.ts', '/src/app/app.component.ts', content =>
          content
            .replace(`templateUrl: './app.html'`, `templateUrl: './app.component.html'`)
            .replace(/styleUrl: '\.\/app\.(\w+)'/, `styleUrl: './app.component.$1'`)
            .replace(/\bApp\b/g, 'AppComponent')
        );
        rename('/src/app/app.html', '/src/app/app.component.html');
        rename('/src/app/app.scss', '/src/app/app.component.scss');

        // app module: app-module.ts -> app.module.ts (fixing App -> AppComponent references)
        rename('/src/app/app-module.ts', '/src/app/app.module.ts', content =>
          content
            .replace(`import { App } from './app';`, `import { AppComponent } from './app.component';`)
            .replace(`from './app-routing-module'`, `from './app-routing.module'`)
            .replace(/\bApp\b/g, 'AppComponent')
        );

        // routing module: app-routing-module.ts -> app-routing.module.ts
        rename('/src/app/app-routing-module.ts', '/src/app/app-routing.module.ts');

        // app spec: app.spec.ts -> app.component.spec.ts
        rename('/src/app/app.spec.ts', '/src/app/app.component.spec.ts', content =>
          content
            .replace(`from './app-module'`, `from './app.module'`)
            .replace(`from './app'`, `from './app.component'`)
            .replace(/\bApp\b/g, 'AppComponent')
        );

        // main.ts import path
        if (tree.exists('/src/main.ts')) {
          tree.overwrite(
            '/src/main.ts',
            tree.readContent('/src/main.ts').replace(`'./app/app-module'`, `'./app/app.module'`)
          );
        }

        return tree;
      })
    );
}

export function createModule(
  schematicRunner: SchematicTestRunner,
  options: ModuleOptions
): OperatorFunction<UnitTestTree, UnitTestTree> {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(switchMap(tree => schematicRunner.runSchematic('module', { ...options, project: 'bar' }, tree)));
}

export function copyFileFromPWA(path: string): OperatorFunction<UnitTestTree, UnitTestTree> {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(
      tap(tree => {
        tree.create(`/${path}`, readFileSync(`../${path}`));
      })
    );
}

export function createAppLastRoutingModule(schematicRunner: SchematicTestRunner) {
  return (source$: Observable<UnitTestTree>) =>
    source$.pipe(
      switchMap(tree =>
        schematicRunner.runExternalSchematic(
          '@schematics/angular',
          'module',
          {
            name: 'pages/app-last-routing',
            flat: true,
            module: 'app.module',
            project: 'bar',
          },
          tree
        )
      ),
      // Angular 20's module schematic generates `app-last-routing-module.ts`; the PWA uses the
      // classic `app-last-routing.module.ts` naming, so normalize the file and its registration.
      map(tree => {
        const generated = '/src/app/pages/app-last-routing-module.ts';
        const classic = '/src/app/pages/app-last-routing.module.ts';
        if (tree.exists(generated)) {
          const content = tree.readContent(generated);
          tree.delete(generated);
          tree.create(classic, content);
        }
        const appModulePath = '/src/app/app.module.ts';
        if (tree.exists(appModulePath)) {
          tree.overwrite(
            appModulePath,
            tree
              .readContent(appModulePath)
              .replace(`from './pages/app-last-routing-module'`, `from './pages/app-last-routing.module'`)
          );
        }
        return tree;
      })
    );
}

export function componentDecorator(input: string, omitChangeDetection = true) {
  const decorator = input.match(/@Component.*}\)/s)?.[0]?.replace(/\s+/g, ' ');
  return omitChangeDetection ? decorator?.replace(' changeDetection: ChangeDetectionStrategy.OnPush,', '') : decorator;
}
