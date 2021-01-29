import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutDetailsPageComponent } from './account-punchout-details-page.component';

const accountPunchoutDetailsPageRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumbData: [
        { key: 'account.punchout.link', link: '/account/punchout' },
        { key: 'account.punchout.user.details.link' },
      ],
    },
    component: AccountPunchoutDetailsPageComponent,
  },
];

@NgModule({
  imports: [PunchoutModule, RouterModule.forChild(accountPunchoutDetailsPageRoutes)],
  declarations: [AccountPunchoutDetailsPageComponent],
})
export class AccountPunchoutDetailsPageModule {}
