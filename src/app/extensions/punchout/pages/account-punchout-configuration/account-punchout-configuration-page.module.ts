import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutConfigurationPageComponent } from './account-punchout-configuration-page.component';
import { OciConfigurationFormComponent } from './oci-configuration-form/oci-configuration-form.component';

const accountPunchoutConfigurationPageRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumbData: [
        { key: 'account.punchout.link', link: '/account/punchout' },
        { key: 'account.punchout.configuration.link' },
      ],
    },
    component: AccountPunchoutConfigurationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountPunchoutConfigurationPageRoutes), PunchoutModule],
  declarations: [AccountPunchoutConfigurationPageComponent, OciConfigurationFormComponent],
})
export class AccountPunchoutConfigurationPageModule {}
