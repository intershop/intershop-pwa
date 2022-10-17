import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { parse } from 'comment-json';
import * as fs from 'fs';

import { normalizePath } from '../helpers';

const messages = {
  noAlias: `Import path should rely on {{alias}}`,
};

/**
 * Finds and replaces import paths which can be simplified by import aliases.
 */
const useAliasImportsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  create: context => {
    const filePath = normalizePath(context.getFilename());
    const basePath = filePath.substring(0, filePath.lastIndexOf('/'));
    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        const literalString = node.source.value.toString();
        const absPath = calculateAbsolutePath(basePath, literalString);
        if (absPath) {
          const aliasImports = getAliasImports();
          aliasImports.forEach(({ pattern, alias }) => {
            if (new RegExp(pattern).test(absPath)) {
              context.report({
                node,
                messageId: 'noAlias',
                data: {
                  alias,
                },
                fix: fixer => fixer.replaceText(node.source, `'${alias}${absPath.replace(new RegExp(pattern), '')}'`),
              });
            }
          });
        }
      },
    };
  },
};

/**
 * calculate the absolute path for the given import
 *
 * @param basePath path to the current file, without the filename
 * @param literal path of the import
 * @returns the absolute path of the import
 */
function calculateAbsolutePath(basePath: string, literal: string): string {
  if (literal.startsWith('..')) {
    const myPath = basePath.split('/');
    const otherPath = literal.split('/').reverse();
    while (otherPath.length && otherPath[otherPath.length - 1] === '..') {
      otherPath.pop();
      myPath.pop();
    }
    for (const el of otherPath.reverse()) {
      myPath.push(el);
    }
    return myPath.join('/');
  }
}

/**
 * get paths with its alias names from the tsconfig.json
 *
 * @returns pairs of path patterns and alias strings, which can be resolved by the tsconfig.json
 */
function getAliasImports(): { pattern: string; alias: string }[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- revert strongly typed CommentJSONValue (since version 4.2.0)
    const config = parse(fs.readFileSync('./tsconfig.json', { encoding: 'utf-8' })) as any;
    if (config?.compilerOptions?.paths) {
      const paths = config.compilerOptions.paths;
      return Object.keys(paths).map(key => ({
        pattern: `.*/${paths[key][0].replace(/\/\*$/, '/')}`,
        alias: key.replace(/\/\*$/, '/'),
      }));
    }
  } catch (err) {
    console.warn(err);
  }
}

export default useAliasImportsRule;
