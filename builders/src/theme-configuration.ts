import type { Target } from '@angular-devkit/architect';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const THEME_PLACEHOLDER = 'theme_placeholder';

interface TargetDefinition {
  options?: Record<string, unknown>;
  configurations?: Record<string, Record<string, unknown>>;
  defaultConfiguration?: string;
}

interface ProjectDefinition {
  root?: string;
  architect?: Record<string, TargetDefinition>;
  targets?: Record<string, TargetDefinition>;
}

export interface AngularWorkspace {
  projects: Record<string, ProjectDefinition>;
}

export interface ThemeConfiguration {
  configuration: string;
  theme: string;
}

function getTargetDefinition(
  workspace: AngularWorkspace,
  target: Pick<Target, 'project' | 'target'>
): TargetDefinition {
  const project = workspace.projects[target.project];
  const definition = project?.architect?.[target.target] ?? project?.targets?.[target.target];

  if (!definition) {
    throw new Error(`Could not find Angular target "${target.project}:${target.target}".`);
  }
  return definition;
}

export function readAngularWorkspace(workspaceRoot: string): AngularWorkspace {
  return JSON.parse(readFileSync(join(workspaceRoot, 'angular.json'), 'utf8')) as AngularWorkspace;
}

export function getMainProject(workspace: AngularWorkspace): string {
  const project = Object.entries(workspace.projects).find(([, definition]) => definition.root === '');
  if (!project) {
    throw new Error('Could not find the main Angular project.');
  }
  return project[0];
}

export function getThemeConfigurations(workspace: AngularWorkspace): ThemeConfiguration[] {
  const project = getMainProject(workspace);
  const build = getTargetDefinition(workspace, { project, target: 'build' });

  return Object.entries(build.configurations ?? {}).flatMap(([configuration, options]) => {
    const theme = options.theme;
    if (typeof theme !== 'string') {
      return [];
    }
    if (configuration !== theme) {
      throw new Error(`Theme configuration "${configuration}" must use the same theme name, found "${String(theme)}".`);
    }
    return [{ configuration, theme }];
  });
}

export function getThemeNames(workspace: AngularWorkspace): string[] {
  return getThemeConfigurations(workspace).map(configuration => configuration.theme);
}

export function getSelectedConfigurationNames(workspace: AngularWorkspace, target: Target): string[] {
  const definition = getTargetDefinition(workspace, target);
  return (target.configuration || definition.defaultConfiguration)?.split(',').filter(Boolean) ?? [];
}

export function resolveTheme(
  workspace: AngularWorkspace,
  target: Target,
  configuredTheme?: string
): ThemeConfiguration {
  const definition = getTargetDefinition(workspace, target);
  const selectedThemes = new Set<string>();

  for (const name of getSelectedConfigurationNames(workspace, target)) {
    const theme = definition.configurations?.[name]?.theme;
    if (typeof theme === 'string') {
      selectedThemes.add(theme);
    }
  }

  const optionTheme = configuredTheme ?? definition.options?.theme;
  if (typeof optionTheme === 'string') {
    selectedThemes.add(optionTheme);
  }

  if (selectedThemes.size !== 1) {
    throw new Error(`Expected exactly one theme configuration, found: ${[...selectedThemes].join(', ') || 'none'}.`);
  }

  const theme = [...selectedThemes][0];
  const availableThemes = getThemeNames(workspace);
  if (!availableThemes.includes(theme)) {
    throw new Error(`Unknown theme "${theme}". Available themes: ${availableThemes.join(', ')}.`);
  }

  return { configuration: theme, theme };
}

export function replaceThemePlaceholder<T>(value: T, theme: string): T {
  if (typeof value === 'string') {
    return value.replaceAll(THEME_PLACEHOLDER, theme) as T;
  }
  if (Array.isArray(value)) {
    return value.map(item => replaceThemePlaceholder(item, theme)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceThemePlaceholder(item, theme)])
    ) as T;
  }
  return value;
}

export function completeBuildConfigurations(configurations: string[], clientOnly: boolean): string[] {
  const completed = configurations.filter(configuration => !clientOnly || configuration !== 'ssr');
  if (!completed.includes('development') && !completed.includes('production')) {
    completed.push('production');
  }
  if (!clientOnly && !completed.includes('ssr')) {
    completed.push('ssr');
  }
  return completed;
}

export function resolveActiveThemes(workspace: AngularWorkspace, configuredThemes?: string): string[] {
  const themes = configuredThemes
    ?.split(',')
    .map(theme => theme.trim())
    .filter(Boolean);

  if (!themes?.length) {
    throw new Error('No active themes configured.');
  }

  const availableThemes = getThemeNames(workspace);
  const unknownThemes = themes.filter(theme => !availableThemes.includes(theme));
  if (unknownThemes.length) {
    throw new Error(
      `Unknown active themes: ${unknownThemes.join(', ')}. Available themes: ${availableThemes.join(', ')}.`
    );
  }

  return themes;
}
