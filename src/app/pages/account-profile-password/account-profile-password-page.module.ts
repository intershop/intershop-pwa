import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfilePasswordPageContainerComponent } from './account-profile-password-page.container';
import { AccountProfilePasswordComponent } from './components/account-profile-password/account-profile-password.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfilePasswordPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfilePasswordComponent, AccountProfilePasswordPageContainerComponent],
})
export class AccountProfilePasswordPageModule {}
