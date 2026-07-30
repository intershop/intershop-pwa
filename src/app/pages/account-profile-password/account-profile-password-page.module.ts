import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfilePasswordPageComponent } from './account-profile-password-page.component';
import { AccountProfilePasswordComponent } from './account-profile-password/account-profile-password.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfilePasswordPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfilePasswordComponent, AccountProfilePasswordPageComponent],
})
export class AccountProfilePasswordPageModule {}
