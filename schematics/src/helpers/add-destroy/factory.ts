import { Rule, SchematicsException, chain } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { Scope } from 'ts-morph';

import { applyLintFix } from '../../utils/lint-fix';
import { createTsMorphProject } from '../../utils/ts-morph';

import { PWAAddDestroySubjectToComponentOptionsSchema as Options } from './schema';

export function add(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);
    let path = `${buildDefaultPath(project)}/${options.name.replace(/.*src\/app\//, '').replace(/\/$/, '')}`;

    if (!path.endsWith('.ts') && host.getDir(path)) {
      const file = host.getDir(path).subfiles.find(el => /(component|pipe|directive)\.ts/.test(el));
      path = `${path}/${file}`;
    }

    if (!path || !host.exists(path)) {
      throw new SchematicsException('Option (path) is required and must exist.');
    }

    const tsMorphProject = createTsMorphProject(host);
    tsMorphProject.addSourceFileAtPath(path);

    const sourceFile = tsMorphProject.getSourceFile(path);
    sourceFile
      .getClasses()
      .filter(clazz => clazz.isExported())
      .forEach(classDeclaration => {
        if (!classDeclaration.getImplements().find(imp => imp.getText() === 'OnDestroy')) {
          classDeclaration.addImplements('OnDestroy');
        }

        if (!classDeclaration.getProperty('destroy$')) {
          classDeclaration.insertProperty(classDeclaration.getProperties().length, {
            name: 'destroy$',
            initializer: 'new Subject()',
            scope: Scope.Private,
          });
        }

        if (!classDeclaration.getMethod('ngOnDestroy')) {
          const onDestroyMethod = classDeclaration.addMethod({
            name: 'ngOnDestroy',
          });

          const methodBody = onDestroyMethod.addBody();
          methodBody.setBodyText(`this.destroy$.next();
this.destroy$.complete();`);
        }
      });

    const angularCoreImport = sourceFile.getImportDeclarationOrThrow(
      imp => imp.getModuleSpecifierValue() === '@angular/core'
    );
    if (!angularCoreImport.getNamedImports().find(el => el.getText() === 'OnDestroy')) {
      angularCoreImport.addNamedImport('OnDestroy');
    }

    const rxjsImport = sourceFile.getImportDeclaration(imp => imp.getModuleSpecifierValue() === 'rxjs');
    if (!rxjsImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['Subject'],
        moduleSpecifier: 'rxjs',
      });
    } else if (!rxjsImport.getNamedImports().find(el => el.getText() === 'Subject')) {
      rxjsImport.addNamedImport('Subject');
    }
    sourceFile.formatText({ indentSize: 2, convertTabsToSpaces: true });
    host.overwrite(path, sourceFile.getText());

    const operations = [];
    if (!options.ci) {
      operations.push(applyLintFix());
    }

    return chain(operations);
  };
}
