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
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileEmailComponent, AccountProfileEmailPageComponent],
})
export class AccountProfileEmailPageModule {}
