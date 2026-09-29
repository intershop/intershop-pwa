import type { Target } from '@angular-devkit/architect';
import type { json } from '@angular-devkit/core';
import type { ApplicationBuilderOptions } from '@angular/build';
import { globSync } from 'glob';
import { posix } from 'node:path';

import { getThemeNames, readAngularWorkspace, replaceThemePlaceholder, resolveTheme } from './theme-configuration.js';

export type CustomApplicationOptions = {
  plugins?: string[];
  indexHtmlTransformer?: string;
  theme?: string;
} & ApplicationBuilderOptions &
  json.JsonObject;

type FileReplacement = NonNullable<ApplicationBuilderOptions['fileReplacements']>[number];

interface Candidate {
  replacement: FileReplacement;
  priority: number;
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

export function discoverThemeReplacements(
  files: string[],
  activeThemes: string[],
  activeTheme: string
): FileReplacement[] {
  const normalizedFiles = files.map(normalizePath);
  const existingFiles = new Set(normalizedFiles);
  const suffixes = new Set([...activeThemes, 'all']);
  const candidates = new Map<string, Candidate[]>();

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

    const original = posix.join(parsed.dir, `${nameParts.join('.')}.ts`);
    if (!existingFiles.has(original)) {
      continue;
    }

    let priority: number;
    if (usedSuffixes.length === 1 && usedSuffixes[0] === activeTheme) {
      priority = 1;
    } else if (usedSuffixes.includes(activeTheme)) {
      priority = 2;
    } else if (usedSuffixes[0] === 'all') {
      priority = 3;
    } else {
      continue;
    }

    const replacement = { replace: original, with: file };
    candidates.set(original, [...(candidates.get(original) ?? []), { replacement, priority }]);
  }

  return [...candidates.entries()]
    .map(([original, replacements]) => {
      const bestPriority = Math.min(...replacements.map(candidate => candidate.priority));
      const selected = replacements.filter(candidate => candidate.priority === bestPriority);
      if (selected.length !== 1) {
        throw new Error(
          `Ambiguous theme overrides for "${original}": ${selected.map(candidate => candidate.replacement.with).join(', ')}`
        );
      }
      return selected[0].replacement;
    })
    .sort((a, b) => a.replace.localeCompare(b.replace));
}

function mergeReplacements(existing: FileReplacement[], discovered: FileReplacement[]): FileReplacement[] {
  const replacements = new Map(existing.map(replacement => [normalizePath(replacement.replace), replacement]));
  for (const replacement of discovered) {
    replacements.set(replacement.replace, replacement);
  }
  return [...replacements.values()];
}

export function applyThemeOverrides(
  options: CustomApplicationOptions,
  workspaceRoot: string,
  target: Target
): { options: CustomApplicationOptions; theme: string; count: number } {
  const workspace = readAngularWorkspace(workspaceRoot);
  const themes = getThemeNames(workspace);
  const theme = resolveTheme(workspace, target, options.theme).theme;
  const files = globSync(['src/**/*.ts', 'projects/**/*.ts'], { cwd: workspaceRoot, nodir: true });
  const discovered = discoverThemeReplacements(files, themes, theme);
  const applicationOptions = replaceThemePlaceholder(options, theme);
  delete applicationOptions.theme;

  return {
    options: {
      ...applicationOptions,
      fileReplacements: mergeReplacements(applicationOptions.fileReplacements ?? [], discovered),
    },
    theme,
    count: discovered.length,
  };
}
