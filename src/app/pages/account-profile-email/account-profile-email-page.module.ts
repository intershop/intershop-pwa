import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileEmailPageComponent } from './account-profile-email-page.component';
import { AccountProfileEmailComponent } from './account-profile-email/account-profile-email.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfileEmailPageComponent,
  },
];

@NgModule({
  declarations: [AccountProfileEmailComponent, AccountProfileEmailPageComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class AccountProfileEmailPageModule {}
