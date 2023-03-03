import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'punchout',
    canActivate: [featureToggleGuard],
    data: { feature: 'punchout' },
    loadChildren: () => import('./punchout/punchout-page.module').then(m => m.PunchoutPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PunchoutRoutingModule {}
