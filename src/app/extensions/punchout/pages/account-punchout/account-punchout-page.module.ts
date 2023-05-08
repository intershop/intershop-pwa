import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutHeaderComponent } from './account-punchout-header/account-punchout-header.component';
import { AccountPunchoutPageComponent } from './account-punchout-page.component';

const accountPunchoutPageRoutes: Routes = [
  { path: '', component: AccountPunchoutPageComponent },
  {
    path: 'configuration',
    loadChildren: () =>
      import('../account-punchout-configuration/account-punchout-configuration-page.module').then(
        m => m.AccountPunchoutConfigurationPageModule
      ),
    canActivate: [featureToggleGuard],
    data: { feature: 'punchout' },
  },
];

@NgModule({
  imports: [NgbNavModule, PunchoutModule, RouterModule.forChild(accountPunchoutPageRoutes)],
  declarations: [AccountPunchoutHeaderComponent, AccountPunchoutPageComponent],
})
export class AccountPunchoutPageModule {}
