import { buildCustomEsbuildApplication } from '@angular-builders/custom-esbuild';
import { createBuilder, type BuilderContext } from '@angular-devkit/architect';

import { applyThemeOverrides, type CustomApplicationOptions } from './theme-overrides.js';

function execute(options: CustomApplicationOptions, context: BuilderContext) {
  if (!context.target) {
    throw new Error('The theme application builder requires a target.');
  }

  const build = applyThemeOverrides(options, context.workspaceRoot, context.target);
  context.logger.info(`Using ${build.count} discovered theme override(s) for "${build.theme}".`);

  return buildCustomEsbuildApplication(build.options, context);
}

export default createBuilder<CustomApplicationOptions>(execute);
