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
  url,
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { forEachToken } from 'tsutils';
import * as ts from 'typescript';

import { applyNameAndPath, determineArtifactName } from '../utils/common';
import { readIntoSourceFile } from '../utils/filesystem';
import { applyLintFix } from '../utils/lint-fix';
import { insertImport } from '../utils/registration';

import { PWAStoreOptionsSchema as Options } from './schema';

export async function determineStoreLocation(
  host: Tree,
  options: {
    path?: string;
    name?: string;
    restricted?: boolean;
    project?: string;
    extension?: string;
    feature?: string;
  }
) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);

  let extension = options.extension;
  const regex = /extensions\/([a-z][a-z0-9-]+)/;
  const requestDestination = normalize(`${options.path}/${options.name}`);
  if (regex.test(requestDestination)) {
    extension = requestDestination.match(regex)[1];
  }

  let feature = options.feature;
  if (!extension && !feature) {
    const nameWOStore = options.name.replace(/.*store\//, '');
    if (nameWOStore.includes('/')) {
      const pathFragments = nameWOStore.split('/');
      feature = pathFragments[pathFragments.length - 2];
    } else {
      feature = 'core';
    }
  }

  const projectName = project.root.replace(/^.*?\//g, '');

  let parent: string;

  let path = options.path;
  if (project.root) {
    parent = projectName;
    path = `${project.sourceRoot}/app/store/`;
  } else if (!extension && !feature) {
    path = `${project.sourceRoot}/app/core/store/core/`;
    parent = 'core';
  } else if (!extension && feature) {
    path = `${project.sourceRoot}/app/core/store/${feature}/`;
    parent = feature;
  } else if (extension && !feature) {
    path = `${project.sourceRoot}/app/extensions/${extension}/store/`;
    parent = extension;
  } else {
    throw new Error('cannot add feature store in extension');
  }
  const name = options.name.split('/').pop();

  if (projectName) {
    // override so it behaves like extension
    extension = projectName;
  }

  if (name === feature) {
    throw new Error('name of feature and store cannot be equal');
  }
  if (name === extension) {
    throw new Error('name of extension and store cannot be equal');
  }

  return {
    ...options,
    parentStorePath: `${path}${parent}`,
    name,
    extension,
    feature,
    path,
    parent,
  };
}

function registerStateInStore(options: { parentStorePath?: string; name?: string; parent?: string }): Rule {
  return host => {
    const artifactName = `${strings.classify(options.name)}State`;
    const file = normalize(`${options.parentStorePath}-store.ts`);
    const parentArtifact = `${strings.classify(options.parent)}State`;

    const source = readIntoSourceFile(host, file);
    const update = host.beginUpdate(file);
    forEachToken(source, node => {
      if (
        node.kind === ts.SyntaxKind.Identifier &&
        node.getText() === parentArtifact &&
        node.parent.kind === ts.SyntaxKind.InterfaceDeclaration
      ) {
        const stateInterface = node.parent;
        const closingBrace = stateInterface.getChildren().filter(n => n.kind === ts.SyntaxKind.CloseBraceToken)[0];
        update.insertLeft(closingBrace.pos, `\n  ${strings.camelize(options.name)}: ${artifactName};`);
      }
    });

    const relativePath = `./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.reducer`;
    insertImport(source, update, artifactName, relativePath);

    host.commitUpdate(update);
    return host;
  };
}

function registerReducerInStoreModule(options: { parentStorePath?: string; name?: string; parent?: string }): Rule {
  return host => {
    const artifactName = `${strings.camelize(options.name)}Reducer`;
    const file = `${options.parentStorePath}-store.module.ts`;
    const parentArtifact = `${strings.camelize(options.parent)}Reducers`;

    const source = readIntoSourceFile(host, file);
    const update = host.beginUpdate(file);

    forEachToken(source, node => {
      if (
        node.kind === ts.SyntaxKind.Identifier &&
        node.getText() === parentArtifact &&
        node.parent.kind === ts.SyntaxKind.VariableDeclaration
      ) {
        const declaration = node.parent as ts.VariableDeclaration;
        const map = declaration.initializer as ts.ObjectLiteralExpression;

        update.insertLeft(
          map.properties.end,
          `${map.properties.hasTrailingComma || map.properties.length === 0 ? '' : ','} ${strings.camelize(
            options.name
          )}: ${artifactName}`
        );
      }
    });

    const relativePath = `./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.reducer`;
    insertImport(source, update, artifactName, relativePath);

    host.commitUpdate(update);
    return host;
  };
}

function registerEffectsInStoreModule(options: { parentStorePath?: string; name?: string; parent?: string }): Rule {
  return host => {
    const artifactName = `${strings.classify(options.name)}Effects`;
    const file = `${options.parentStorePath}-store.module.ts`;
    const parentArtifact = `${strings.camelize(options.parent)}Effects`;

    const source = readIntoSourceFile(host, file);
    const update = host.beginUpdate(file);

    forEachToken(source, node => {
      if (
        node.kind === ts.SyntaxKind.Identifier &&
        node.getText() === parentArtifact &&
        node.parent.kind === ts.SyntaxKind.VariableDeclaration
      ) {
        const declaration = node.parent as ts.VariableDeclaration;
        const list = declaration.initializer as ts.ArrayLiteralExpression;

        update.insertLeft(
          list.elements.end,
          `${list.elements.hasTrailingComma || list.elements.length === 0 ? '' : ','} ${artifactName}`
        );
      }
    });

    const relativePath = `./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.effects`;
    insertImport(source, update, artifactName, relativePath);

    host.commitUpdate(update);
    return host;
  };
}

export function createStore(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await determineStoreLocation(host, options);
    options = await applyNameAndPath('store', host, options);
    options = determineArtifactName('store', host, options);

    const operations: Rule[] = [];
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
    operations.push(registerStateInStore(options));
    operations.push(registerEffectsInStoreModule(options));
    operations.push(registerReducerInStoreModule(options));

    operations.push(applyLintFix());

    return chain(operations);
  };
}
