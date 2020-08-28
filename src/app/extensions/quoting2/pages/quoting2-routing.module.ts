import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'quote-list',
    loadChildren: () => import('./quote-list/quote-list-page.module').then(m => m.QuoteListPageModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'quoting2' },
  },
  {
    path: 'quote-debug',
    loadChildren: () => import('./quote-debug/quote-debug-page.module').then(m => m.QuoteDebugPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Quoting2RoutingModule {}
