import { normalize, strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  schematic,
  template,
  url,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';
import { forEachToken, getChildOfKind } from 'tsutils';
import * as ts from 'typescript';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { readIntoSourceFile } from '../utils/filesystem';

import { PwaPageOptionsSchema as Options } from './schema';

function addRouteToArray(
  options: { name?: string; routingModule?: string; child?: string },
  host: Tree,
  position: number,
  insertComma: boolean
) {
  const dasherizedName = strings.dasherize(options.name);

  const loadChildren = `() => import('${
    options.child ? '..' : '.'
  }/${dasherizedName}/${dasherizedName}-page.module').then(m => m.${strings.classify(dasherizedName)}PageModule)`;
  const path = options.child ? options.child : dasherizedName;
  const canActivate =
    options.routingModule === '/src/app/pages/app-routing.module.ts' ? 'canActivate: [MetaGuard],' : '';

  const recorder = host.beginUpdate(options.routingModule);
  recorder.insertRight(
    position,
    `${insertComma ? ', ' : ''}{ path: '${path}', loadChildren: ${loadChildren}, ${canActivate} }`
  );
  host.commitUpdate(recorder);
}

function determineRoutingModule(host: Tree, options: { name?: string; project?: string; extension?: string }) {
  const project = getProject(host, options.project);

  let routingModuleLocation: string;
  let child: string;

  const match = options.name.match(/(.*)\-([a-z0-9]+)/);
  if (match && match[1] && match[2]) {
    const parent = match[1];
    child = match[2];
    // tslint:disable-next-line:no-console
    console.log(`detected subpage, will insert '${child}' as sub page of '${parent}'`);
    routingModuleLocation = options.extension
      ? `extensions/${options.extension}/pages/${parent}/${parent}-page.module.ts`
      : `pages/${parent}/${parent}-page.module.ts`;
  } else {
    routingModuleLocation = options.extension
      ? `extensions/${options.extension}/pages/${options.extension}-routing.module.ts`
      : 'pages/app-routing.module.ts';
  }

  const routingModule = normalize(`${buildDefaultPath(project)}/${routingModuleLocation}`);
  return {
    ...options,
    routingModule,
    child,
  };
}

export function addRouteToRoutingModule(options: { extension?: string; project?: string; name?: string }): Rule {
  return host => {
    const newOptions = determineRoutingModule(host, options);
    const source = readIntoSourceFile(host, newOptions.routingModule);
    forEachToken(source, node => {
      if (node.kind === ts.SyntaxKind.Identifier && /^[a-zA-Z0-9]*(R|r)outes$/.test(node.getText())) {
        const parent = node.parent;
        if (parent.kind === ts.SyntaxKind.VariableDeclaration) {
          const routesArray = getChildOfKind(parent, ts.SyntaxKind.ArrayLiteralExpression);
          if (routesArray) {
            const routes = getChildOfKind(routesArray, ts.SyntaxKind.SyntaxList) as ts.SyntaxList;
            if (routes.getChildCount() > 0) {
              const lastChild = routes.getChildren()[routes.getChildCount() - 1];
              const insertComma = lastChild.kind !== ts.SyntaxKind.CommaToken;
              addRouteToArray(newOptions, host, lastChild.end, insertComma);
            } else {
              addRouteToArray(newOptions, host, routes.end, false);
            }
          }
        }
      }
    });
  };
}

export function createPage(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = detectExtension('page', host, options);
    options = applyNameAndPath('page', host, options);
    options = determineArtifactName('page', host, options);

    const operations: Rule[] = [];
    operations.push(
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            ...options,
          }),
          move(options.path),
        ])
      )
    );
    operations.push(
      schematic('component', {
        ...options,
        name: `${options.name}-page`,
        path: `${options.path}${options.name}`,
        flat: true,
      })
    );
    operations.push(addRouteToRoutingModule(options));

    return chain(operations);
  };
}
