import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SelectivePreloadingStrategy } from 'ish-core/routing/selective-preloading-strategy';

import { appRoutes } from './app.routes';

/**
 * Main application routing module.
 * Routes are defined in app.routes.ts for better tree-shaking and standalone component support.
 * Uses SelectivePreloadingStrategy for optimized route preloading based on route priority.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      anchorScrolling: 'enabled',
      preloadingStrategy: SelectivePreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
