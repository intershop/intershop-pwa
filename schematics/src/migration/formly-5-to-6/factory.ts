import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Formly6Migration as Options } from 'schemas/migration/formly-5-to-6/schema';
import { Expression, PropertyAccessExpression, SourceFile, SyntaxKind, ts } from 'ts-morph';

import { createTsMorphProject } from '../../utils/ts-morph';

const PROPERTY_REPLACEMENTS: { search: string[]; replace: string }[] = [
  { search: ['templateOptions'], replace: 'props' },
  { search: ['validation', 'messages', 'minlength'], replace: 'minLength' },
  { search: ['validation', 'messages', 'maxlength'], replace: 'maxLength' },
];

const FIELD_TYPE_REPLACEMENTS: { search: string[]; replace: string }[] = [{ search: ['to'], replace: 'props' }];

const foundLastAccessProperty = (
  access: PropertyAccessExpression<ts.PropertyAccessExpression>
): PropertyAccessExpression<ts.PropertyAccessExpression> => {
  const parent = access.getParentIfKind(SyntaxKind.PropertyAccessExpression);
  return parent ? foundLastAccessProperty(parent) : access;
};

/* eslint-disable complexity */
/**
 * find property in binary and access expressions and replace it's value
 *
 * @param propertyName name of a FormlyFieldConfig property
 *
 * (1) if a method is given, which set the value of the property by a method
 * (2) if a method is given, which set the value of the property directly
 * (3) if a access expression is given
 */
function findPropertyAndReplace(source: SourceFile, expression: Expression<ts.Expression>, propertyName: string) {
  if (expression.isKind(SyntaxKind.BinaryExpression)) {
    const access = expression.getLeft().asKind(SyntaxKind.PropertyAccessExpression);
    const operator = expression.getOperatorToken().asKind(SyntaxKind.EqualsToken);
    const value = expression.getRight();
    if (operator) {
      if (value.isKind(SyntaxKind.CallExpression)) {
        const methodAccess = value.getExpressionIfKind(SyntaxKind.PropertyAccessExpression);
        if (methodAccess?.getExpressionIfKind(SyntaxKind.ThisKeyword)) {
          const method = source
            .getDescendantsOfKind(SyntaxKind.MethodDeclaration)
            .find(methods => methods.getName() === methodAccess.getName());
          const returnStatement = method
            ?.getBody()
            .asKind(SyntaxKind.Block)
            .getStatementByKind(SyntaxKind.ReturnStatement);
          if (
            returnStatement
              ?.getExpression()
              .isKind(SyntaxKind.ArrayLiteralExpression || SyntaxKind.ObjectLiteralExpression)
          ) {
            overwriteProperty(returnStatement.getExpression());
          }
        }
      } else {
        if (access?.getName() === propertyName) {
          overwriteProperty(value);
        } else {
          const identifier = access
            ?.getDescendantsOfKind(SyntaxKind.Identifier)
            .find(identifier => identifier.getText() === propertyName);
          if (identifier) {
            overwriteProperty(access);
          }
        }
      }
    }
  } else if (
    expression.isKind(SyntaxKind.PropertyAccessExpression) &&
    expression?.getDescendantsOfKind(SyntaxKind.Identifier).find(identifier => identifier.getText() === propertyName)
  ) {
    overwriteProperty(expression);
  }
}

/**
 * will find property of a FormlyFieldConfig expression, which will be replaced with a new value
 *
 */
function overwriteProperty(expression: Expression<ts.Expression>) {
  if (!expression) {
    return;
  }

  if (expression.isKind(SyntaxKind.ArrayLiteralExpression)) {
    expression.getElements().map(overwriteProperty);
  }

  // fieldGroup, fieldArray and defaultOptions have FormlyFieldConfig as return type
  if (expression.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const initializer = expression
      .getProperties()
      .find(p =>
        p
          .asKind(SyntaxKind.PropertyAssignment)
          ?.getName()
          .match(new RegExp('(fieldGroup|fieldArray|defaultOptions)$', 'g'))
      )
      ?.asKind(SyntaxKind.PropertyAssignment)
      .getInitializer();

    if (initializer) {
      overwriteProperty(initializer);
    }
  }

  PROPERTY_REPLACEMENTS.map(prop => {
    // find correct expression which presents a property, which should be replaced
    // property must be found along the given search path
    const expr = prop.search.reduce((prev, curr, idx) => {
      if (prev?.isKind(SyntaxKind.ObjectLiteralExpression)) {
        const property = prev
          .getProperties()
          ?.find(p => p.isKind(SyntaxKind.PropertyAssignment) && p.getName() === curr)
          ?.asKind(SyntaxKind.PropertyAssignment);

        if (property) {
          if (idx === prop.search.length - 1) {
            return prev;
          } else if (property.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression)) {
            return property.getInitializer();
          } else {
            return;
          }
        }
      } else if (prev?.isKind(SyntaxKind.PropertyAccessExpression)) {
        if (idx === 0) {
          return prev.getName() === curr
            ? prev
            : prev.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)?.find(p => p.getName() === curr);
        } else {
          const next = prev.getFirstAncestorByKind(SyntaxKind.PropertyAccessExpression);
          return next?.getName() === curr ? next : undefined;
        }
      }
    }, expression);

    // replace property name
    if (expr?.isKind(SyntaxKind.ObjectLiteralExpression)) {
      expr
        .getProperty(prop.search[prop.search.length - 1])
        .asKind(SyntaxKind.PropertyAssignment)
        .getNameNode()
        .replaceWithText(prop.replace);
    } else if (expr?.isKind(SyntaxKind.PropertyAccessExpression)) {
      expr.getNameNode().replaceWithText(prop.replace);
    }
  });
}

/**
 * Replace properties within a component template
 *
 * @param tsFile path name of ts file
 * @param searchTerm Regex to find correct properties, which should be replaced - PLACEHOLDER key must be included to replace it with different search keys
 * @param replacement replacement key
 */
function overwriteInTemplate(host: Tree, tsFile: string, searchTerm: string) {
  const htmlFile = tsFile.replace(new RegExp(/.ts$/g), '.html');
  const content = host.read(htmlFile)?.toString();

  if (!content || !searchTerm) {
    return;
  }

  // eslint-disable-next-line prettier/prettier
  const overwrite = [...PROPERTY_REPLACEMENTS, ...FIELD_TYPE_REPLACEMENTS].reduce(
    (prev, curr) =>
      prev.replace(new RegExp(searchTerm.replace('PLACEHOLDER', curr.search.join('\\.')), 'g'), curr.replace),
    content
  );
  // overwrite template in case the template has changed
  if (content !== overwrite) {
    host.overwrite(htmlFile, overwrite);
  }
}

/**
 * Returns the used import name of a specific import
 *
 * @returns the import name or the specified alias
 */
function getUsedImportName(source: SourceFile, importName: string, libraryName: string): string {
  return source
    .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
    .map(node => {
      if (node.getModuleSpecifierValue() === libraryName) {
        return node
          .getNamedImports()
          ?.map(i => (i.getName() === importName ? i.getAliasNode()?.getText() ?? importName : undefined))
          .find(i => !!i);
      }
    })
    .find(i => !!i);
}

/* eslint-disable complexity */
export function migrateFormly(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    const tsProject = createTsMorphProject(host);

    const fileVisitor = (filePath: string) => {
      if (filePath.endsWith('.ts') && !filePath.endsWith('spec.ts')) {
        const source = tsProject.addSourceFileAtPath(filePath);

        // find used import names for FormlyFieldConfig and FormlyModule imports

        const formlyConfigName =
          getUsedImportName(source, 'FormlyFieldConfig', '@ngx-formly/core') ??
          getUsedImportName(source, 'FormlyFieldConfig', '@ngx-formly/core/lib/core');

        const formlyModuleName =
          getUsedImportName(source, 'FormlyModule', '@ngx-formly/core') ??
          getUsedImportName(source, 'FormlyModule', '@ngx-formly/core/lib/core');

        const fieldTypeName =
          getUsedImportName(source, 'FieldType', '@ngx-formly/core') ??
          getUsedImportName(source, 'FieldType', '@ngx-formly/core/lib/core');

        const fieldWrapperName =
          getUsedImportName(source, 'FieldWrapper', '@ngx-formly/core') ??
          getUsedImportName(source, 'FieldWrapper', '@ngx-formly/core/lib/core');

        const fieldArrayTypeName =
          getUsedImportName(source, 'FieldArrayType', '@ngx-formly/core') ??
          getUsedImportName(source, 'FieldArrayType', '@ngx-formly/core/lib/core');

        const formlyExtensionName =
          getUsedImportName(source, 'FormlyExtension', '@ngx-formly/core') ??
          getUsedImportName(source, 'FormlyExtension', '@ngx-formly/core/lib/core');

        // CUSTOM INTERSHOP FORMLY IMPLEMENTATION - find used import names for addressesFieldConfiguration imports
        const addressConfImport = getUsedImportName(
          source,
          'addressesFieldConfiguration',
          'ish-shared/formly-address-forms/configurations/address-form.configuration'
        );

        // Regex which checks if a property/ method is type of FormlyFieldConfig or FormlyFieldConfig[]
        const testFormlyConfigMatcher = (testString: string) =>
          formlyConfigName && testString ? new RegExp(`^${formlyConfigName}(?=$|\\[]$)`, 'gm').test(testString) : false;

        source.forEachDescendant(node => {
          // variable with formly type
          if (node.isKind(SyntaxKind.VariableDeclaration) && testFormlyConfigMatcher(node.getTypeNode()?.getText())) {
            if (node.getInitializer()) {
              overwriteProperty(node.getInitializer());
            }

            node
              .getFirstAncestorByKind(SyntaxKind.Block)
              .getDescendantsOfKind(SyntaxKind.BinaryExpression)
              .map(expression => {
                findPropertyAndReplace(source, expression, node.getName());
              });
          }

          // method with formly return type
          if (
            node.isKind(SyntaxKind.MethodDeclaration) &&
            testFormlyConfigMatcher(node.getReturnTypeNode()?.getText())
          ) {
            const statement = node.getStatementByKind(SyntaxKind.ReturnStatement);
            if (
              statement?.getExpressionIfKind(SyntaxKind.ObjectLiteralExpression) ||
              statement?.getExpressionIfKind(SyntaxKind.ArrayLiteralExpression)
            ) {
              overwriteProperty(statement.getExpression());
            }
          }

          // classes which extends from FieldWrapper or FieldType
          if (
            node.isKind(SyntaxKind.HeritageClause) &&
            node.getToken() === SyntaxKind.ExtendsKeyword &&
            node
              .getTypeNodes()
              .find(type =>
                type.getText().match(new RegExp(`(^${fieldWrapperName}|^${fieldTypeName}|^${fieldArrayTypeName})`))
              )
          ) {
            // class access field, defaultOptions or to property
            source.getDescendantsOfKind(SyntaxKind.ThisKeyword).map(expression => {
              const accessProperty = expression.getFirstAncestorByKind(SyntaxKind.PropertyAccessExpression);
              if (accessProperty?.getName() === 'field' || accessProperty?.getName() === 'defaultOptions') {
                overwriteProperty(foundLastAccessProperty(accessProperty));
                overwriteInTemplate(
                  host,
                  filePath,
                  '(?:(?<=["(\\s]defaultOptions\\?\\.)|(?<=["(\\s]defaultOptions\\.))PLACEHOLDER(?=\\.|"|\\s|\\?)'
                );
              } else if (accessProperty?.getName() === 'to') {
                accessProperty.getFirstChildByKind(SyntaxKind.Identifier).replaceWithText('props');
              }
            });

            // defines a defaultOptions property
            source.getDescendantsOfKind(SyntaxKind.PropertyDeclaration).map(prop => {
              if (
                prop.getName() === 'defaultOptions' &&
                prop.getInitializer()?.isKind(SyntaxKind.ObjectLiteralExpression)
              ) {
                overwriteProperty(prop.getInitializer());
                overwriteInTemplate(
                  host,
                  filePath,
                  '(?:(?<=["(\\s]defaultOptions\\?\\.)|(?<=["(\\s]defaultOptions\\.))PLACEHOLDER(?=\\.|"|\\s|\\?)'
                );
              }
            });

            overwriteInTemplate(host, filePath, '(?<=["(\\s])PLACEHOLDER(?=\\.|"|\\s|\\?)');
          }

          // defined methods from FormlyExtension interface
          const matchedMethods = new Set(['prePopulate', 'onPopulate', 'postPopulate']);

          // classes which implements from FormlyExtension
          if (
            node.isKind(SyntaxKind.HeritageClause) &&
            node.getToken() === SyntaxKind.ImplementsKeyword &&
            node.getTypeNodes().find(type => type.getText() === formlyExtensionName)
          ) {
            // configured populate method and access parameter property within
            source.getDescendantsOfKind(SyntaxKind.MethodDeclaration).map(method => {
              if (matchedMethods.has(method.getName())) {
                const parameter = method.getParameters()[0]?.getName();
                method
                  .getDescendantsOfKind(SyntaxKind.Identifier)
                  .filter(identifier => identifier.getText() === parameter)
                  .map(identifier => {
                    const parent = identifier.getFirstAncestorByKind(SyntaxKind.PropertyAccessExpression);
                    if (parent) {
                      overwriteProperty(foundLastAccessProperty(parent));
                    }
                  });
              }
            });
          }

          // FormlyExtension is used as variable type
          if (
            node.isKind(SyntaxKind.VariableDeclaration) &&
            node.getTypeNode()?.getText() === formlyExtensionName &&
            node.getInitializer()?.isKind(SyntaxKind.ObjectLiteralExpression)
          ) {
            const properties = node.getInitializer().asKind(SyntaxKind.ObjectLiteralExpression).getProperties();
            properties.map(property => {
              // populate method is initialized with a arrow function or a method
              if (property.isKind(SyntaxKind.PropertyAssignment) && matchedMethods.has(property.getName())) {
                const initializer = property.getInitializer().asKind(SyntaxKind.ArrowFunction);
                const parameter = initializer.getParameters()[0].getName();
                property
                  .getDescendantsOfKind(SyntaxKind.Identifier)
                  .filter(identifier => identifier.getText() === parameter)
                  .map(identifier => {
                    const parent = identifier.getParentIfKind(SyntaxKind.PropertyAccessExpression);
                    if (parent) {
                      overwriteProperty(foundLastAccessProperty(parent));
                    }
                  });
              } else if (property.isKind(SyntaxKind.MethodDeclaration) && matchedMethods.has(property.getName())) {
                const parameter = property.getParameters()[0].getName();
                property
                  .getDescendantsOfKind(SyntaxKind.Identifier)
                  .filter(identifier => identifier.getText() === parameter)
                  .map(identifier => {
                    const parent = identifier.getParentIfKind(SyntaxKind.PropertyAccessExpression);
                    if (parent) {
                      overwriteProperty(foundLastAccessProperty(parent));
                    }
                  });
              }
            });
          }

          // a method is declared, which uses a FormlyFieldConfig parameter
          if (node.isKind(SyntaxKind.MethodDeclaration)) {
            const parameter = node.getParameters().find(p => testFormlyConfigMatcher(p.getTypeNode()?.getText()));

            // find all expressions, which could access parameter information
            if (parameter) {
              node.getDescendants().map(expression => {
                if (
                  expression.isKind(SyntaxKind.BinaryExpression) ||
                  expression.isKind(SyntaxKind.PropertyAccessExpression)
                ) {
                  findPropertyAndReplace(source, expression, parameter.getName());
                }
              });
            }
          }

          // FormlyModule.forChild configuration
          if (
            formlyModuleName &&
            node.isKind(SyntaxKind.CallExpression) &&
            node.getExpression()?.getText() === `${formlyModuleName}.forChild` &&
            node.getArguments()[0].isKind(SyntaxKind.ObjectLiteralExpression)
          ) {
            const arg = node.getArguments()[0].asKind(SyntaxKind.ObjectLiteralExpression);
            const typesInitializer = arg
              .getProperties()
              .find(prop => prop.asKind(SyntaxKind.PropertyAssignment).getName() === 'types')
              ?.asKind(SyntaxKind.PropertyAssignment)
              .getInitializer();
            overwriteProperty(typesInitializer);
          }

          // FormlyFieldConfig class property is declared
          if (node.isKind(SyntaxKind.PropertyDeclaration) && testFormlyConfigMatcher(node.getTypeNode()?.getText())) {
            // find where property is initialized
            source.getDescendantsOfKind(SyntaxKind.BinaryExpression).map(expression => {
              findPropertyAndReplace(source, expression, node.getName());
            });

            overwriteInTemplate(
              host,
              filePath,
              `(?:(?<=["(\\s]${node.getName()}\\?\\.)|(?<=["(\\s]${node.getName()}\\.))PLACEHOLDER(?=\\.|"|\\s|\\?)`
            );
          }

          // CUSTOM INTERSHOP FORMLY IMPLEMENTATION
          // method addressesFieldConfiguration is called
          if (
            addressConfImport &&
            node.isKind(SyntaxKind.CallExpression) &&
            node.getExpressionIfKind(SyntaxKind.Identifier)?.getText() === addressConfImport
          ) {
            const argument = node.getArguments()[0].asKind(SyntaxKind.ArrayLiteralExpression);

            // find parameter elements which could potentially by FormlyFieldConfig properties
            argument
              .getElements()
              .filter(el => el.isKind(SyntaxKind.ArrayLiteralExpression || SyntaxKind.ObjectLiteralExpression))
              .map(overwriteProperty);
          }
        });

        if (host.read(filePath)?.toString() !== source.getFullText()) {
          host.overwrite(filePath, source.getFullText());
        }
      }
    };

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);

    host.getDir(`/${project.sourceRoot}`).visit(fileVisitor);
  };
}
