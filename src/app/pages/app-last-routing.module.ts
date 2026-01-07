import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { appLastRoutes } from './app-last.routes';

/**
 * Fallback routing module for product, category, content pages and 404.
 * Routes are defined in app-last.routes.ts for better tree-shaking and standalone component support.
 * This module must be imported last in the app module to ensure catch-all routes work correctly.
 */
@NgModule({
  imports: [RouterModule.forChild(appLastRoutes)],
})
export class AppLastRoutingModule {}
