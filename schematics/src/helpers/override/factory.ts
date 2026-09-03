import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { getThemeNames, type AngularWorkspace } from 'intershop-builders/dist/theme-configuration.js';
import { normalize, posix } from 'path';
import { OverrideOptionsSchema as Options } from 'schemas/helpers/override/schema';
import { Node, ObjectLiteralExpression, Project } from 'ts-morph';

function getComponentMetadata(host: Tree, componentFile: string) {
  const content = host.read(componentFile);
  if (!content) {
    throw new SchematicsException(`Could not read "${componentFile}".`);
  }

  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(componentFile, content.toString());
  const decorator = sourceFile
    .getClasses()
    .map(classDeclaration => classDeclaration.getDecorator('Component'))
    .find(Boolean);
  const metadata = decorator?.getArguments()[0];

  if (!Node.isObjectLiteralExpression(metadata)) {
    throw new SchematicsException(`Could not find component metadata in "${componentFile}".`);
  }

  return { metadata, sourceFile };
}

function setProperty(metadata: ObjectLiteralExpression, name: string, initializer: string) {
  const property = metadata.getProperty(name);
  if (Node.isPropertyAssignment(property)) {
    property.setInitializer(initializer);
  } else if (property) {
    throw new SchematicsException(`Component metadata property "${name}" cannot be updated.`);
  } else {
    metadata.addPropertyAssignment({ name, initializer });
  }
}

export function updateComponentResources(
  host: Tree,
  componentFile: string,
  resources: { html?: string; scss?: { original: string; override: string } }
) {
  const { metadata, sourceFile } = getComponentMetadata(host, componentFile);

  if (resources.html) {
    const templateUrl = metadata.getProperty('templateUrl');
    if (!Node.isPropertyAssignment(templateUrl)) {
      throw new SchematicsException('Template overrides require a component with an external template.');
    }
    templateUrl.setInitializer(`'./${posix.basename(resources.html)}'`);
  }

  if (resources.scss) {
    const themedStylePath = `./${posix.basename(resources.scss.override)}`;
    const themedStyle = `'${themedStylePath}'`;
    if (metadata.getProperty('styleUrl')) {
      setProperty(metadata, 'styleUrl', themedStyle);
    } else if (!metadata.getProperty('styleUrls')) {
      setProperty(metadata, 'styleUrls', `[${themedStyle}]`);
    } else {
      const styleUrls = metadata.getProperty('styleUrls');
      const initializer = Node.isPropertyAssignment(styleUrls) ? styleUrls.getInitializer() : undefined;
      if (!Node.isArrayLiteralExpression(initializer)) {
        throw new SchematicsException('Component metadata property "styleUrls" must be an inline array.');
      }

      const originalStylePath = `./${posix.basename(resources.scss.original)}`;
      const originalStyle = initializer
        .getElements()
        .find(element => Node.isStringLiteral(element) && element.getLiteralValue() === originalStylePath);

      if (Node.isStringLiteral(originalStyle)) {
        originalStyle.setLiteralValue(themedStylePath);
      } else {
        initializer.addElement(themedStyle);
      }
    }
  }

  host.overwrite(componentFile, sourceFile.getFullText());
}

export function override(options: Options): Rule {
  // eslint-disable-next-line complexity
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
    const path = normalize(options.path ?? '')
      .replace(/\\/g, '/')
      .replace(/^\./, '');
    let from = normalize(options.from).replace(/\\/g, '/');
    from = `${path ? `${path}/` : !from.startsWith(`${sourceRoot}/app/`) ? `${sourceRoot}/app/` : ''}${from.replace(
      /\/$/,
      ''
    )}`;
    if (!host.exists(from) || !from.endsWith('.ts')) {
      throw new SchematicsException('Input does not point to an existing TypeScript file.');
    }

    if (!options.theme) {
      throw new SchematicsException('Option (theme) is required.');
    }

    if (options.theme !== 'all') {
      const angularJson = host.read('/angular.json');
      const themes = angularJson ? getThemeNames(JSON.parse(angularJson.toString()) as AngularWorkspace) : [];
      if (!themes.includes(options.theme)) {
        throw new SchematicsException(
          `Unknown theme "${options.theme}". Available themes: ${[...themes, 'all'].join(', ')}.`
        );
      }
    }

    if ((options.html || options.scss) && !from.includes('.component.')) {
      throw new SchematicsException('Template and Style overrides only work on components.');
    }

    const themedTs = from.replace(/\.ts$/, `.${options.theme}.ts`);
    const themedHtml = options.html ? from.replace(/\.ts$/, `.${options.theme}.html`) : undefined;
    const themedScss = options.scss ? from.replace(/\.ts$/, `.${options.theme}.scss`) : undefined;

    if (!host.exists(themedTs)) {
      host.create(themedTs, host.read(from));
    }

    if (themedHtml) {
      host.create(themedHtml, 'OVERRIDE');
    }

    if (themedScss) {
      host.create(themedScss, `/* style definitions for overriding with theme "${options.theme}" */`);
    }

    if (themedHtml || themedScss) {
      updateComponentResources(host, themedTs, {
        html: themedHtml,
        scss: themedScss ? { original: from.replace(/\.ts$/, '.scss'), override: themedScss } : undefined,
      });
    }

    return host;
  };
}
