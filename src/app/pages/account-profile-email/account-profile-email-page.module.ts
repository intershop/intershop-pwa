import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileEmailPageContainerComponent } from './account-profile-email-page.container';
import { AccountProfileEmailComponent } from './components/account-profile-email/account-profile-email.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileEmailPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileEmailComponent, AccountProfileEmailPageContainerComponent],
})
export class AccountProfileEmailPageModule {}
