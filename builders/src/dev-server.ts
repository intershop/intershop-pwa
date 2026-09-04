import { executeCustomDevServerBuilder } from '@angular-builders/custom-esbuild';
import { createBuilder, targetFromTargetString, type BuilderContext, type Target } from '@angular-devkit/architect';
import type { json } from '@angular-devkit/core';
import type { DevServerBuilderOptions } from '@angular/build';
import { from, switchMap } from 'rxjs';

import { applyThemeOverrides, type CustomApplicationOptions } from './theme-overrides.js';

type CustomDevServerOptions = {
  middlewares?: string[];
} & DevServerBuilderOptions &
  json.JsonObject;

function isTarget(candidate: Target, expected: Target): boolean {
  return (
    candidate.project === expected.project &&
    candidate.target === expected.target &&
    candidate.configuration === expected.configuration
  );
}

export function createDevServerContext(
  context: BuilderContext,
  buildTarget: Target,
  buildOptions: CustomApplicationOptions
): BuilderContext {
  const delegated = Object.create(context) as BuilderContext;

  delegated.getTargetOptions = async target =>
    isTarget(target, buildTarget) ? buildOptions : context.getTargetOptions(target);
  delegated.getBuilderNameForTarget = async target =>
    isTarget(target, buildTarget) ? '@angular/build:application' : context.getBuilderNameForTarget(target);

  return delegated;
}

function execute(options: CustomDevServerOptions, context: BuilderContext) {
  const buildTarget = targetFromTargetString(options.buildTarget);

  return from(context.getTargetOptions(buildTarget)).pipe(
    switchMap(rawOptions => {
      const build = applyThemeOverrides(rawOptions as CustomApplicationOptions, context.workspaceRoot, buildTarget);
      context.logger.info(`Using ${build.count} discovered theme override(s) for "${build.theme}".`);

      return executeCustomDevServerBuilder(options, createDevServerContext(context, buildTarget, build.options));
    })
  );
}

export default createBuilder<CustomDevServerOptions>(execute);
