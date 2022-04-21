import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact-page.module').then(m => m.ContactPageModule),
    canActivate: [FeatureToggleGuard],
    data: { feature: 'contactUs' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUsRoutingModule {}
