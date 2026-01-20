import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { PunchoutStoreModule } from '../store/punchout-store.module';

import { punchoutPageGuard } from './punchout/punchout-page.guard';

const routes: Routes = [
  {
    path: 'punchout',
    canActivate: [featureToggleGuard, punchoutPageGuard],
    data: { feature: 'punchout' },
    providers: [importProvidersFrom(PunchoutStoreModule)],
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PunchoutRoutingModule {}
