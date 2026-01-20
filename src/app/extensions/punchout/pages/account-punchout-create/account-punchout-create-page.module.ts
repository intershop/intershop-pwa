import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPunchoutCreatePageComponent } from './account-punchout-create-page.component';

const accountPunchoutCreatePageRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumbData: [
        { key: 'account.punchout.link', link: '/account/punchout' },
        { key: 'account.punchout.create.link' },
      ],
    },
    component: AccountPunchoutCreatePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountPunchoutCreatePageRoutes)],
})
export class AccountPunchoutCreatePageModule {}
