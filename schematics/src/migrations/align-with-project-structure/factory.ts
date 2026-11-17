import { Rule, Tree, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { posix } from 'path';
import { ExportDeclaration, Identifier, ImportDeclaration, Node, SourceFile, SyntaxKind } from 'ts-morph';

import { applyLintFix } from '../../utils/lint-fix';
import { logMigrationStart } from '../../utils/log-migration';
import { createTsMorphProject } from '../../utils/ts-morph';

export interface MovedFile {
  from: string;
  to: string;
  renames?: Record<string, string>;
}

/**
 * Files moved with Intershop PWA 14.0.0 to match the project structure, as `ish-core` import paths, with the exports
 * renamed along with them.
 */
export const MOVED_FILES: MovedFile[] = [
  {
    from: 'ish-core/models/checkout/checkout-step.type',
    to: 'ish-core/models/checkout-step/checkout-step.type',
    renames: { CheckoutStepType: 'CheckoutStep' },
  },
  {
    from: 'ish-core/models/metrics/metrics-detail-level',
    to: 'ish-core/configurations/injection-keys',
  },
  {
    from: 'ish-core/models/paypal-client-config/paypal-client-config',
    to: 'ish-core/models/paypal-config/paypal-config.model',
  },
  {
    from: 'ish-core/directives/intersection-observer-util',
    to: 'ish-core/directives/utils/intersection-observer',
  },
];

const MEMBER_NAME_KINDS = [
  SyntaxKind.EnumMember,
  SyntaxKind.GetAccessor,
  SyntaxKind.MethodDeclaration,
  SyntaxKind.MethodSignature,
  SyntaxKind.PropertyAssignment,
  SyntaxKind.PropertyDeclaration,
  SyntaxKind.PropertySignature,
  SyntaxKind.SetAccessor,
];

const toProjectPath = (aliasPath: string) => aliasPath.replace(/^ish-core\//, '/src/app/core/');

/**
 * Returns the moved file the module specifier points to, either via its `ish-core` path or a relative path.
 */
function findMovedFile(filePath: string, moduleSpecifier: string, movedFiles: MovedFile[]): MovedFile | undefined {
  if (moduleSpecifier.startsWith('.')) {
    const target = posix.join(posix.dirname(filePath), moduleSpecifier);
    return movedFiles.find(moved => toProjectPath(moved.from) === target);
  }
  return movedFiles.find(moved => moved.from === moduleSpecifier);
}

/**
 * Keeps relative module specifiers relative and `ish-core` ones aliased.
 */
function getNewModuleSpecifier(filePath: string, moduleSpecifier: string, moved: MovedFile): string {
  if (!moduleSpecifier.startsWith('.')) {
    return moved.to;
  }
  const relative = posix.relative(posix.dirname(filePath), toProjectPath(moved.to));
  return relative.startsWith('.') ? relative : `./${relative}`;
}

/**
 * Returns whether the identifier is the name of a member or property access, e.g. in `foo.CheckoutStepType`.
 */
function isMemberName(identifier: Identifier): boolean {
  const parent = identifier.getParent();
  if (Node.isPropertyAccessExpression(parent)) {
    return parent.getNameNode() === identifier;
  }
  if (Node.isQualifiedName(parent)) {
    return parent.getRight() === identifier;
  }
  return (
    MEMBER_NAME_KINDS.includes(parent.getKind()) &&
    (parent as unknown as { getNameNode(): Node }).getNameNode() === identifier
  );
}

/**
 * Renames all references of an imported binding in the file.
 */
function renameLocalReferences(sourceFile: SourceFile, oldName: string, newName: string): void {
  sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter(identifier => identifier.getText() === oldName)
    .filter(identifier => !identifier.getFirstAncestorByKind(SyntaxKind.ImportDeclaration))
    .filter(identifier => !identifier.getFirstAncestorByKind(SyntaxKind.ExportDeclaration)?.getModuleSpecifier())
    .filter(identifier => !isMemberName(identifier))
    .reverse()
    .forEach(identifier => {
      const parent = identifier.getParent();
      if (Node.isShorthandPropertyAssignment(parent)) {
        parent.replaceWithText(`${oldName}: ${newName}`);
      } else {
        identifier.replaceWithText(newName);
      }
    });
}

/**
 * Renames `namespace.OldName` accesses for namespace imports of a moved file.
 */
function renameNamespaceAccesses(sourceFile: SourceFile, namespace: string, renames: Record<string, string>): void {
  sourceFile
    .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
    .filter(access => access.getExpression().getText() === namespace && renames[access.getName()])
    .reverse()
    .forEach(access => access.getNameNode().replaceWithText(renames[access.getName()]));
}

function migrateImport(sourceFile: SourceFile, declaration: ImportDeclaration, moved: MovedFile): void {
  const renames = moved.renames ?? {};
  const namespace = declaration.getNamespaceImport()?.getText();
  if (namespace) {
    renameNamespaceAccesses(sourceFile, namespace, renames);
  }
  for (const specifier of declaration.getNamedImports()) {
    const newName = renames[specifier.getName()];
    if (newName) {
      if (!specifier.getAliasNode()) {
        renameLocalReferences(sourceFile, specifier.getName(), newName);
      }
      specifier.setName(newName);
    }
  }
}

function migrateExport(declaration: ExportDeclaration, moved: MovedFile): void {
  const renames = moved.renames ?? {};
  for (const specifier of declaration.getNamedExports()) {
    const newName = renames[specifier.getName()];
    if (newName) {
      specifier.setName(newName);
    }
  }
}

const isPlainNamedImport = (declaration: ImportDeclaration) =>
  !declaration.getDefaultImport() && !declaration.getNamespaceImport() && declaration.getNamedImports().length > 0;

/**
 * Moves the named imports of a declaration into an existing import of the same module, e.g. when
 * `MetricsDetailLevel` now comes from `ish-core/configurations/injection-keys` like `METRICS_DETAIL_LEVEL`.
 */
function mergeIntoExistingImport(sourceFile: SourceFile, declaration: ImportDeclaration): void {
  if (!isPlainNamedImport(declaration)) {
    return;
  }
  const other = sourceFile
    .getImportDeclarations()
    .find(
      decl =>
        decl !== declaration &&
        decl.getModuleSpecifierValue() === declaration.getModuleSpecifierValue() &&
        decl.isTypeOnly() === declaration.isTypeOnly() &&
        isPlainNamedImport(decl)
    );
  if (!other) {
    return;
  }
  // keep the later declaration, removing the last import would also remove the blank line after the imports
  const [removed, kept] = [declaration, other].sort((a, b) => a.getStart() - b.getStart());
  const present = new Set(kept.getNamedImports().map(specifier => specifier.getText()));
  kept.addNamedImports(
    removed
      .getNamedImports()
      .map(specifier => specifier.getText())
      .filter(specifier => !present.has(specifier))
  );
  removed.remove();
}

/**
 * Points the imports and re-exports of moved files to their new location and applies the renames.
 */
export function migrateSourceFile(sourceFile: SourceFile, filePath: string, movedFiles: MovedFile[]): void {
  const migratedImports: ImportDeclaration[] = [];

  for (const declaration of [...sourceFile.getImportDeclarations(), ...sourceFile.getExportDeclarations()]) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    const moved = moduleSpecifier && findMovedFile(filePath, moduleSpecifier, movedFiles);
    if (!moved) {
      continue;
    }
    if (Node.isImportDeclaration(declaration)) {
      migrateImport(sourceFile, declaration, moved);
      migratedImports.push(declaration);
    } else {
      migrateExport(declaration, moved);
    }
    declaration.setModuleSpecifier(getNewModuleSpecifier(filePath, moduleSpecifier, moved));
  }

  for (const declaration of migratedImports) {
    if (!declaration.wasForgotten()) {
      mergeIntoExistingImport(sourceFile, declaration);
    }
  }
}

/**
 * Skips moves whose old file still exists, e.g. because a project kept a customized copy of it.
 */
function getApplicableMoves(host: Tree): MovedFile[] {
  return MOVED_FILES.filter(moved => {
    const oldFile = `${toProjectPath(moved.from)}.ts`;
    if (host.exists(oldFile)) {
      process.stdout.write(`Skipping '${moved.from}': ${oldFile} still exists, update its imports manually.\n`);
      return false;
    }
    return true;
  });
}

/**
 * Returns the TypeScript files of all workspace projects and of the workspace root, e.g. `server.ts`.
 */
async function getTypeScriptFiles(host: Tree): Promise<Set<string>> {
  const workspace = await getWorkspace(host);
  const sourceRoots = new Set(
    [...workspace.projects.values()].map(project => project.sourceRoot ?? project.root).filter(Boolean)
  );
  const isTypeScriptFile = (file: string) => file.endsWith('.ts') && !file.endsWith('.d.ts');

  const files = new Set(
    host
      .getDir('/')
      .subfiles.filter(isTypeScriptFile)
      .map(file => `/${file}`)
  );
  for (const sourceRoot of sourceRoots) {
    host.getDir(`/${sourceRoot}`).visit(file => {
      if (isTypeScriptFile(file)) {
        files.add(file);
      }
    });
  }
  return files;
}

/**
 * Updates the imports of custom code for files that Intershop PWA 14.0.0 renamed or moved to match the
 * `ish-custom-rules/project-structure` ESLint rule (see the migration note "Renamed and moved files"), and renames
 * the exports renamed along with them.
 */
export function migrateAlignWithProjectStructure(): Rule {
  return chain([
    logMigrationStart('align-with-project-structure'),
    async host => {
      const movedFiles = getApplicableMoves(host);
      if (!movedFiles.length) {
        return;
      }
      const tsProject = createTsMorphProject(host);
      const fileNames = movedFiles.map(moved => posix.basename(moved.from));

      for (const filePath of await getTypeScriptFiles(host)) {
        const content = host.read(filePath)?.toString();
        if (!content || !fileNames.some(fileName => content.includes(fileName))) {
          continue;
        }

        const sourceFile = tsProject.getSourceFile(filePath) ?? tsProject.addSourceFileAtPath(filePath);
        const originalText = sourceFile.getFullText();

        migrateSourceFile(sourceFile, filePath, movedFiles);

        if (sourceFile.getFullText() !== originalText) {
          host.overwrite(filePath, sourceFile.getFullText());
        }
      }
    },
    applyLintFix(),
  ]);
}
