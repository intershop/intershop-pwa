import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutCreatePageComponent } from './account-punchout-create-page.component';

const accountPunchoutCreatePageRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumbData: [
        { key: 'account.punchout.link', link: '/account/punchout' },
        { key: 'account.punchout.oci.create.link' },
      ],
    },
    component: AccountPunchoutCreatePageComponent,
  },
];

@NgModule({
  imports: [PunchoutModule, RouterModule.forChild(accountPunchoutCreatePageRoutes)],
  declarations: [AccountPunchoutCreatePageComponent],
})
export class AccountPunchoutCreatePageModule {}
