import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AccountProfileUserPageContainerComponent } from './account-profile-user-page.container';
import { AccountProfileUserPageComponent } from './components/account-profile-user-page/account-profile-user-page.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileUserPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileUserPageComponent, AccountProfileUserPageContainerComponent],
})
export class AccountProfileUserPageModule {}
