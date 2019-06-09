import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AccountProfilePasswordPageContainerComponent } from './account-profile-password-page.container';
import { AccountProfilePasswordPageComponent } from './components/account-profile-password-page/account-profile-password-page.component';

const routes: Routes = [
  {
    path: '',
    component: AccountProfilePasswordPageContainerComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfilePasswordPageComponent, AccountProfilePasswordPageContainerComponent],
})
export class AccountProfilePasswordPageModule {}
