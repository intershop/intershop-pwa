import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileUserPageContainerComponent } from './account-profile-user-page.container';
import { AccountProfileUserComponent } from './components/account-profile-user/account-profile-user.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileUserPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileUserComponent, AccountProfileUserPageContainerComponent],
})
export class AccountProfileUserPageModule {}
