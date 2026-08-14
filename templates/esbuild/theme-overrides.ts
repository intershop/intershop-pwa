import type { Target } from '@angular-devkit/architect';
import type { Plugin } from 'esbuild';
import { globSync } from 'glob';
import { posix } from 'node:path';

import { activeThemes, getBuildConfigurations, getSingleConfiguration } from './build-configuration';

interface FileReplacement {
  replace: string;
  with: string;
}

interface BuilderOptions {
  buildTarget?: string;
  fileReplacements?: FileReplacement[];
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

export function discoverThemeReplacements(
  files: string[],
  themes: readonly string[],
  activeTheme: string
): FileReplacement[] {
  const normalizedFiles = files.map(normalizePath);
  const existingFiles = new Set(normalizedFiles);
  const suffixes = new Set([...themes, 'all']);
  const candidates = new Map<string, { replacement: FileReplacement; specific: boolean }[]>();

  for (const file of normalizedFiles.filter(
    candidate => candidate.endsWith('.ts') && !candidate.endsWith('.spec.ts')
  )) {
    const parsed = posix.parse(file);
    const nameParts = parsed.name.split('.');
    const usedSuffixes: string[] = [];

    while (nameParts.length && suffixes.has(nameParts.at(-1)!)) {
      usedSuffixes.unshift(nameParts.pop()!);
    }

    if (!usedSuffixes.length) {
      continue;
    }
    if (usedSuffixes.includes('all') && usedSuffixes.length > 1) {
      throw new Error(`Override for "all" cannot be combined with theme names: ${file}`);
    }

    const specific = usedSuffixes.includes(activeTheme);
    if (!specific && !usedSuffixes.includes('all')) {
      continue;
    }

    const original = posix.join(parsed.dir, `${nameParts.join('.')}.ts`);
    if (!existingFiles.has(original)) {
      continue;
    }

    const replacement = { replace: original, with: file };
    candidates.set(original, [...(candidates.get(original) ?? []), { replacement, specific }]);
  }

  return [...candidates.entries()]
    .map(([, replacements]) => {
      const specific = replacements.filter(candidate => candidate.specific);
      const selected = specific.length ? specific : replacements;
      return selected[0].replacement;
    })
    .sort((a, b) => a.replace.localeCompare(b.replace));
}

export function findThemeReplacements(workspaceRoot: string, theme: string): FileReplacement[] {
  const files = globSync(['src/**/*.ts', 'projects/**/*.ts'], {
    cwd: workspaceRoot,
    nodir: true,
  });

  return discoverThemeReplacements(files, activeThemes, theme);
}

function mergeReplacements(existing: FileReplacement[], discovered: FileReplacement[]): FileReplacement[] {
  const replacements = new Map(existing.map(replacement => [normalizePath(replacement.replace), replacement]));

  for (const replacement of discovered) {
    replacements.set(replacement.replace, replacement);
  }

  return [...replacements.values()];
}

export default (builderOptions: BuilderOptions, target: Target): Plugin => {
  const configurations = getBuildConfigurations(builderOptions, target);
  const theme = getSingleConfiguration(configurations, activeThemes, 'theme');
  const replacements = findThemeReplacements(process.cwd(), theme);

  builderOptions.fileReplacements = mergeReplacements(builderOptions.fileReplacements ?? [], replacements);

  return {
    name: 'theme-overrides',
    setup() {
      // Replacements must be registered in the factory before Angular normalizes its compiler options.
    },
  };
};
