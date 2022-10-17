import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { kebabCase } from 'lodash';

import { normalizePath } from '../helpers';

export interface RuleSetting {
  warnUnmatched?: boolean;
  ignoredFiles: string[];
  pathPatterns: string[];
  reusePatterns: {
    name: string;
    theme: string;
  };
  patterns: {
    name: string;
    file: string;
  }[];
  allowedNumberWords?: string[];
}

const messages = {
  projectStructureError: `{{message}}`,
};

/**
 * Allows you to check file paths, file names and containing class names against specified patterns.
 *
 * warnUnmatched: enables printing an error when the file and its containing class name have no match.
 * reusePatterns: named RegExp patterns which can be used (like: <name>) in the following patterns.
 * pathPatterns: RegExp patterns to check the directory/path of the file.
 * patterns: RegExp patterns to check whether the class name matches its file.
 * ignoredFiles: RegExp patterns files which should be ignored.
 * allowedNumberWords: List of words containing numbers that will be treated as normal for the sake of kebab-case. Usually, numbers are treated as their own words.
 */
const projectStructureRule: TSESLint.RuleModule<keyof typeof messages, [RuleSetting]> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [
      {
        type: 'object',
        additionalProperties: {
          warnUnmatched: { type: 'boolean' },
          ignoredFiles: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          pathPatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          reusePatterns: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              theme: { type: 'string' },
            },
            additionalProperties: false,
          },
          patterns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                file: { type: 'string' },
              },
              additionalProperties: false,
            },
          },
          allowedNumberWords: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  create: context => {
    const config = { ...context.options[0] };
    const filePath = normalizePath(context.getFilename());
    // make sure arrays exist
    config.ignoredFiles = config.ignoredFiles ?? [];
    config.pathPatterns = config.pathPatterns ?? [];
    config.patterns = config.patterns ?? [];
    config.allowedNumberWords = config.allowedNumberWords ?? [];
    // create list of allowed number words in kebab case
    const kebabSubstitutionDict = config.allowedNumberWords.reduce(
      (acc, curr) => ({
        ...acc,
        [kebabCase(curr)]: curr,
      }),
      {}
    );
    // create regex to match any of the allowed words
    const kebabRegex = `(${config.allowedNumberWords.reduce(
      (acc, curr, idx) => `${kebabCase(curr)}${idx === 0 ? '' : '|'}${acc}`,
      ''
    )})`;

    // don't continue for ignored files
    if (isIgnoredFile(config.ignoredFiles, config.reusePatterns, filePath)) {
      return {};
    }
    return {
      'Program:exit'(node: TSESTree.Program) {
        // return error, when configured pattern doesn't match
        if (!matchPathPattern(config.pathPatterns, config.reusePatterns, filePath)) {
          context.report({
            node: node.body[0],
            messageId: 'projectStructureError',
            data: {
              message: `${filePath} this file path does not match any defined patterns.`,
            },
          });
        }
      },
      'ClassDeclaration > Identifier.id'(node: TSESTree.Identifier): void {
        const matchPatternError = matchPattern(
          config.patterns,
          config.warnUnmatched,
          config.reusePatterns,
          node.name,
          filePath,
          kebabRegex,
          kebabSubstitutionDict
        );
        // return error, when the class name doesn't match to the according file pattern
        if (matchPatternError !== '') {
          context.report({
            node,
            data: {
              message: matchPatternError,
            },
            messageId: 'projectStructureError',
          });
        }
      },
    };
  },
};

/**
 * replace in the pattern string, which is going to be checked reuse pattern like name or theme
 */
function reusePattern(pattern: string, reusePatterns: { [name: string]: string }): string {
  return pattern.replace(/<(.*?)>/g, (original, reuse) => reusePatterns?.[reuse] ?? original);
}

/**
 * return the string in camel case format
 */
const camelCaseFromPascalCase = (input: string): string =>
  `${input.substring(0, 1).toLowerCase()}${input.substring(1)}`;

/**
 * return true the current file to check matches to the path pattern list
 */
function matchPathPattern(
  pathPatterns: string[],
  reusePatterns: { [name: string]: string },
  filePath: string
): boolean {
  return pathPatterns.some(pattern => new RegExp(reusePattern(pattern, reusePatterns)).test(filePath));
}

/**
 * return true the current file to check matches to the ignored file list
 */
function isIgnoredFile(ignoredFiles: string[], reusePatterns: { [name: string]: string }, filePath: string): boolean {
  if (ignoredFiles.length === 0) {
    return false;
  }
  return ignoredFiles.some(ignoredFile => new RegExp(reusePattern(ignoredFile, reusePatterns)).test(filePath));
}

/**
 * return error string, when the class name doesn't match the according path pattern for the current file
 */
function matchPattern(
  patterns: { name: string; file: string }[],
  warnUnmatched: boolean,
  reusePatterns: { [name: string]: string },
  className: string,
  filePath: string,
  kebabRegex: string,
  kebabSubstitutionDict: Record<string, string>
): string {
  const matchingPatterns = patterns
    .map(pattern => ({ pattern, match: new RegExp(reusePattern(pattern.name, reusePatterns)).exec(className) }))
    .filter(x => !!x.match);
  if (matchingPatterns.length >= 1 && matchingPatterns[0].match[1]) {
    const config = matchingPatterns[0];
    const matched = config.match[1];
    const pathPattern = config.pattern.file
      .replace(/<kebab>/g, kebabCaseFromPascalCase(matched, kebabRegex, kebabSubstitutionDict))
      .replace(/<camel>/g, camelCaseFromPascalCase(matched));

    if (!new RegExp(reusePattern(pathPattern, reusePatterns)).test(filePath)) {
      return `'${className}' is not in the correct file (expected '${new RegExp(
        reusePattern(pathPattern, reusePatterns)
      )}')`;
    }
  } else if (matchingPatterns.length === 0 && warnUnmatched) {
    return `no pattern match for ${className} in file ${filePath}`;
  }
  return '';
}

/**
 * return the string in kebab case format, respecting the allowed words that contain numbers
 */
const kebabCaseFromPascalCase = (
  input: string,
  kebabRegex: string,
  kebabSubstitutionDict: Record<string, string>
): string => {
  const k = kebabCase(input);
  const match = k.match(kebabRegex);
  return match?.[1] ? k.replace(match[1], kebabSubstitutionDict[match[1]]) : k;
};

export default projectStructureRule;
