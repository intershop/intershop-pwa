import { normalize, strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  schematic,
  url,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { PWAPageOptionsSchema as Options } from 'schemas/page/schema';
import * as ts from 'typescript';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { readIntoSourceFile } from '../utils/filesystem';
import { applyLintFix } from '../utils/lint-fix';
import { addImportToFile } from '../utils/registration';
import { forEachToken, getChildOfKind } from '../utils/ts-helpers';

function addRouteToArray(
  options: { name?: string; routingModule?: string; child?: string; lazy?: boolean; extension?: string },
  host: Tree,
  position: number,
  insertComma: boolean
) {
  const dasherizedName = strings.dasherize(options.name);
  const path = options.child ? options.child : options.lazy ? dasherizedName : dasherizedName.replace(/-/g, '/');

  const guard = options.extension
    ? `, canActivate: [featureToggleGuard], data: { feature: '${strings.camelize(options.extension)}' }`
    : '';

  if (options.lazy) {
    const routesExport = `${strings.camelize(options.name)}PageRoutes`;
    const loadChildren = `() => import('${
      options.child ? '..' : '.'
    }/${dasherizedName}/${dasherizedName}-page.routes').then(m => m.${routesExport})`;

    const recorder = host.beginUpdate(options.routingModule);
    recorder.insertRight(
      position,
      `${insertComma ? ', ' : ''}{ path: '${path}', loadChildren: ${loadChildren}${guard} }`
    );
    host.commitUpdate(recorder);
  } else {
    const recorder = host.beginUpdate(options.routingModule);
    recorder.insertRight(
      position,
      `${insertComma ? ', ' : ''}{ path: '${path}', component: ${strings.classify(options.name)}PageComponent${guard} }`
    );
    host.commitUpdate(recorder);
  }
}

async function determineRoutingModule(
  host: Tree,
  options: { name?: string; project?: string; extension?: string; lazy?: boolean }
) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);

  let routingModuleLocation: string;
  let child: string;
  let subPaging: boolean;

  const findExisting = (candidates: string[]) =>
    candidates.find(file => host.exists(`${project.sourceRoot}/app/${file}`));

  const match = options.name.match(/(.*)\-([a-z0-9]+)/);
  if (options.lazy && match?.[1] && match[2]) {
    const parent = match[1];
    const possibleChild = match[2];
    const subPagingCandidates = options.extension
      ? [`extensions/${options.extension}/pages/${parent}/${parent}-page.routes.ts`]
      : [`pages/${parent}/${parent}-page.routes.ts`];

    routingModuleLocation = findExisting(subPagingCandidates);

    subPaging = Boolean(routingModuleLocation);
    if (subPaging) {
      child = possibleChild;
      console.log(`detected subpage, will insert '${child}' as sub page of '${parent}'`);
    }
  }

  if (!subPaging) {
    const rootRouteFile = `${project.root ? `pages/${project.root.replace(/^.*?\//g, '')}` : 'pages/app'}.routes.ts`;
    const routingCandidates = options.extension
      ? [`extensions/${options.extension}/pages/${options.extension}.routes.ts`]
      : [rootRouteFile];

    routingModuleLocation = findExisting(routingCandidates) || routingCandidates[0];
  }

  let routingModule: string = normalize(`${buildDefaultPath(project)}/${routingModuleLocation}`);
  const alternateModule = routingModule.replace('.ts', '.all.ts');
  if (host.exists(alternateModule)) {
    routingModule = alternateModule;
  }

  return {
    ...options,
    routingModule,
    child,
  };
}

export function addRouteToRoutingModule(options: {
  extension?: string;
  project?: string;
  name?: string;
  routingModule?: string;
}): Rule {
  return host => {
    const source = readIntoSourceFile(host, options.routingModule);
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
              addRouteToArray(options, host, lastChild.end, insertComma);
            } else {
              addRouteToArray(options, host, routes.end, false);
            }
          }
        }
      }
    });
  };
}

export function createPage(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await detectExtension('page', host, options);
    options = await applyNameAndPath('page', host, options);
    options = determineArtifactName('page', host, options);
    options = await determineRoutingModule(host, options);

    const operations: Rule[] = [];

    if (options.lazy) {
      operations.push(
        mergeWith(
          apply(url('./files'), [
            applyTemplates({
              ...strings,
              ...options,
            }),
            move(options.path),
          ])
        )
      );
    } else {
      operations.push(addImportToFile({ ...options, module: options.routingModule }));
    }

    operations.push(
      schematic('component', {
        project: options.project,
        name: `${options.name}-page`,
        path: `${options.path}${options.name}`,
        flat: true,
      })
    );

    operations.push(addRouteToRoutingModule(options));
    if (options.extension && !host.read(options.routingModule)?.toString().includes('ish-core/feature-toggle')) {
      operations.push(
        addImportToFile({
          module: options.routingModule,
          artifactName: 'featureToggleGuard',
          moduleImportPath: '/src/app/core/feature-toggle',
        })
      );
    }
    operations.push(applyLintFix());

    return chain(operations);
  };
}
