import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileUsernamePageComponent } from './account-profile-username-page.component';
import { AccountProfileUsernameComponent } from './account-profile-username/account-profile-username.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileUsernamePageComponent,
  },
];

@NgModule({
  declarations: [AccountProfileUsernameComponent, AccountProfileUsernamePageComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class AccountProfileUsernamePageModule {}
