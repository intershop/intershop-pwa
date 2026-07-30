import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileUserPageComponent } from './account-profile-user-page.component';
import { AccountProfileUserComponent } from './account-profile-user/account-profile-user.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileUserPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileUserComponent, AccountProfileUserPageComponent],
})
export class AccountProfileUserPageModule {}
