import { normalize, strings } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { validateHtmlSelector, validateName } from '@schematics/angular/utility/validation';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';

import { buildSelector } from './selector';

export async function applyNameAndPath(
  artifact: string,
  host: Tree,
  options: {
    project?: string;
    name?: string;
    path?: string;
    restricted?: boolean;
    flat?: boolean;
    artifactFolder?: boolean;
  }
) {
  let path = options.path;
  let name = options.name;

  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);

  // remove possible added path from root
  if (name && name.startsWith('src/app/')) {
    name = name.substr(8);
  }

  const parsedPath = parseName(path || buildDefaultPath(project), name);
  name = parsedPath.name;
  if (artifact) {
    name = name.replace(new RegExp(`\-?${artifact}$`), '');
  }

  if (!options.restricted) {
    path = parsedPath.path;
  }
  if (options.artifactFolder) {
    // add artifact folder
    const containingFolder = `/${artifact}s`;
    if (!options.flat && !path.endsWith(containingFolder)) {
      path += containingFolder;
    }
  }

  validateName(name);

  return {
    ...options,
    name,
    path,
  };
}

export function determineArtifactName(
  artifact: string,
  _: Tree,
  options: {
    project?: string;
    name?: string;
    path?: string;
    restricted?: boolean;
    flat?: boolean;
    artifactFolder?: boolean;
  }
) {
  const kebab = strings.dasherize(options.name);
  let moduleImportPath;
  let artifactName;

  if (artifact === 'page') {
    moduleImportPath = `/${options.path}${kebab}/${kebab}-page.component`;
    artifactName = strings.classify(`${options.name}PageComponent`);
  } else {
    moduleImportPath = `/${options.path}${options.flat ? '' : `/${kebab}`}/${kebab}.${artifact}`;
    artifactName = strings.classify(`${options.name}-${artifact}`);
  }

  return {
    ...options,
    moduleImportPath,
    artifactName,
  };
}

export async function detectExtension(
  artifact: string,
  host: Tree,
  options: { path?: string; name?: string; restricted?: boolean; project?: string; extension?: string }
) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);
  let extension = options.extension;
  const regex = /extensions\/([a-z][a-z0-9-]+)/;
  const requestDestination = normalize(`${options.path}/${options.name}`);
  if (regex.test(requestDestination)) {
    extension = requestDestination.match(regex)[1];
  }

  let path = options.path;
  if (options.restricted) {
    if (!extension) {
      let rootLocation: string;
      if (artifact === 'cms') {
        rootLocation = 'shared/';
      } else if (['page', 'extension'].includes(artifact) || project.root) {
        rootLocation = '';
      } else {
        rootLocation = 'core/';
      }
      path = `${project.sourceRoot}/app/${rootLocation}${artifact.replace(/s$/, '')}s/`;
    } else {
      path = `${project.sourceRoot}/app/extensions/${extension}/${artifact}s/`;
    }
  }

  return {
    ...options,
    extension,
    path,
  };
}

export function findDeclaringModule(host: Tree, options: { name?: string }) {
  const module = findModuleFromOptions(host, { ...options, name: options.name as string });
  return {
    ...options,
    module,
  };
}

export async function generateSelector(
  host: Tree,
  options: { project?: string; selector?: string; name?: string; prefix?: string }
) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);
  const selector = options.selector || buildSelector(options, project.prefix);
  validateHtmlSelector(selector);

  return {
    ...options,
    selector,
  };
}
