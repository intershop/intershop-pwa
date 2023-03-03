import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'recently',
    loadChildren: () => import('./recently/recently-page.module').then(m => m.RecentlyPageModule),
    canActivate: [featureToggleGuard],
    data: { feature: 'recently' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentlyRoutingModule {}
