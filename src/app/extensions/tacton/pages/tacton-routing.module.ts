import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { authGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'configure',
    loadChildren: () => import('./configure/configure-page.module').then(m => m.ConfigurePageModule),
    canActivate: [featureToggleGuard, authGuard],
    data: {
      feature: 'tacton',
      queryParams: {
        messageKey: 'tacton',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TactonRoutingModule {}
