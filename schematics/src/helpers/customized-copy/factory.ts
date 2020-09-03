import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { basename, join } from 'path';
import * as ts from 'typescript';

import { applyNameAndPath, determineArtifactName, findDeclaringModule } from '../../utils/common';
import { readIntoSourceFile } from '../../utils/filesystem';
import { addDeclarationToNgModule } from '../../utils/registration';
import { updateComponentClassName, updateComponentDecorator, updateComponentSelector } from '../move-component/factory';

import { CustomizedCopyOptionsSchema as Options } from './schema';

export function customize(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    if (!options.from) {
      throw new SchematicsException('Option (from) is required.');
    }

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);
    const sourceRoot = project.sourceRoot;
    const from = `${
      options.path ? options.path + '/' : !options.from?.startsWith(sourceRoot + '/app/') ? sourceRoot + '/app/' : ''
    }${options.from.replace(/\/$/, '')}`;
    const dir = host.getDir(from);

    const fromName = basename(dir.path);

    if (!dir || !dir.subfiles.length || !dir.subfiles.find(v => v.endsWith('component.ts'))) {
      throw new SchematicsException('Option (from) is not pointing to a component folder.');
    }

    dir.subfiles.forEach(file => {
      host.create(
        join(dir.parent.path, `${project.prefix}-${fromName}`, `${project.prefix}-${file}`),
        host.read(dir.file(file).path)
      );
    });

    const toName = `${project.prefix}-${fromName}`;
    host.visit(file => {
      if (file.startsWith(`/${sourceRoot}/app/`) && !file.includes(`/${fromName}/${fromName}.component`)) {
        if (file.includes(`/${project.prefix}-${fromName}/`) && file.endsWith('.component.ts')) {
          updateComponentDecorator(host, file, `ish-${fromName}`, fromName);
          updateComponentDecorator(host, file, fromName, toName);
        }
        if (file.endsWith('.ts')) {
          updateComponentClassName(
            host,
            file,
            strings.classify(fromName) + 'Component',
            strings.classify(toName) + 'Component'
          );

          const imports = tsquery(
            readIntoSourceFile(host, file),
            file.includes(toName) ? `ImportDeclaration` : `ImportDeclaration[text=/.*${fromName}.*/]`
          ).filter((x: ts.ImportDeclaration) => file.includes(fromName) || x.getText().includes(`/${fromName}/`));
          if (imports.length) {
            const updates: { node: ts.Node; replacement: string }[] = [];
            imports.forEach(importDeclaration => {
              tsquery(importDeclaration, 'StringLiteral').forEach(node => {
                const replacement = node
                  .getFullText()
                  .replace(new RegExp(`/${fromName}/${fromName}.component`), `/${toName}/${toName}.component`)
                  .replace(new RegExp(`/${fromName}.component`), `/${toName}.component`);
                if (node.getFullText() !== replacement) {
                  updates.push({ node, replacement });
                }
              });
            });
            if (updates.length) {
              const updater = host.beginUpdate(file);
              updates.forEach(({ node, replacement }) => {
                updater.remove(node.pos, node.end - node.pos).insertLeft(node.pos, replacement);
              });
              host.commitUpdate(updater);
            }
          }
        }
        updateComponentSelector(host, file, fromName, `${project.prefix}-${fromName}`, false);
      }
    });

    let options2: unknown = { name: from, project: options.project };
    options2 = await applyNameAndPath('component', host, options2);
    options2 = determineArtifactName('component', host, options2);
    options2 = findDeclaringModule(host, options2);

    return addDeclarationToNgModule(options2);
  };
}
