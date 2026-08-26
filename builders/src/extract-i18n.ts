import { createBuilder, targetFromTargetString, type BuilderContext, type Target } from '@angular-devkit/architect';
import { executeExtractI18nBuilder, type ExtractI18nBuilderOptions } from '@angular-devkit/build-angular';
import type { json } from '@angular-devkit/core';
import type { ApplicationBuilderOptions } from '@angular/build';

type CustomApplicationOptions = {
  indexHtmlTransformer?: string;
  plugins?: json.JsonValue[];
} & ApplicationBuilderOptions &
  json.JsonObject;

function isTarget(candidate: Target, expected: Target): boolean {
  return (
    candidate.project === expected.project &&
    candidate.target === expected.target &&
    candidate.configuration === expected.configuration
  );
}

function stockApplicationOptions(options: CustomApplicationOptions): ApplicationBuilderOptions & json.JsonObject {
  const applicationOptions = { ...options };
  delete applicationOptions.indexHtmlTransformer;
  delete applicationOptions.plugins;

  return applicationOptions;
}

export function createExtractI18nContext(
  context: BuilderContext,
  buildTarget: Target,
  buildOptions: CustomApplicationOptions
): BuilderContext {
  const delegated = Object.create(context) as BuilderContext;
  const applicationOptions = stockApplicationOptions(buildOptions);

  delegated.getTargetOptions = async target =>
    isTarget(target, buildTarget) ? applicationOptions : context.getTargetOptions(target);
  delegated.getBuilderNameForTarget = async target =>
    isTarget(target, buildTarget)
      ? '@angular-devkit/build-angular:application'
      : context.getBuilderNameForTarget(target);

  return delegated;
}

async function execute(options: ExtractI18nBuilderOptions, context: BuilderContext) {
  const project = context.target?.project;
  if (!project) {
    return executeExtractI18nBuilder(options, context);
  }

  const buildTarget = targetFromTargetString(options.buildTarget ?? ':', project, 'build');
  const buildOptions = (await context.getTargetOptions(buildTarget)) as CustomApplicationOptions;

  return executeExtractI18nBuilder(options, createExtractI18nContext(context, buildTarget, buildOptions));
}

export default createBuilder<ExtractI18nBuilderOptions>(execute);
