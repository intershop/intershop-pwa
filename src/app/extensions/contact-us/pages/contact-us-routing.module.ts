import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { fetchContactSubjectsGuard } from '../guards/fetch-contact-subjects.guard';

const routes: Routes = [
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact-page.module').then(m => m.ContactPageModule),
    canActivate: [featureToggleGuard, fetchContactSubjectsGuard],
    data: { feature: 'contactUs' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ContactUsRoutingModule {}
