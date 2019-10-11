import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileEmailPageContainerComponent } from './account-profile-email-page.container';
import { AccountProfileEmailPageComponent } from './components/account-profile-email-page/account-profile-email-page.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileEmailPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileEmailPageComponent, AccountProfileEmailPageContainerComponent],
})
export class AccountProfileEmailPageModule {}
