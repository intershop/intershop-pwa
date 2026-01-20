import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SelectivePreloadingStrategy } from 'ish-core/routing/selective-preloading-strategy';

import { appLastRoutes } from './app-last.routes';
import { appRoutes } from './app.routes';

/**
 * Main application routing module.
 * Routes are defined in app.routes.ts and app-last.routes.ts for better tree-shaking and standalone component support.
 * Uses SelectivePreloadingStrategy for optimized route preloading based on route priority.
 *
 * Note: appLastRoutes must come after appRoutes to ensure catch-all routes work correctly.
 */
@NgModule({
  imports: [
    RouterModule.forRoot([...appRoutes, ...appLastRoutes], {
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
