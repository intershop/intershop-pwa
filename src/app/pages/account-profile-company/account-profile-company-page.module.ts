import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AccountProfileCompanyPageContainerComponent } from './account-profile-company-page.container';
import { AccountProfileCompanyPageComponent } from './components/account-profile-company-page/account-profile-company-page.component';

const accountProfileCompanyPageRoutes: Routes = [{ path: '', component: AccountProfileCompanyPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(accountProfileCompanyPageRoutes), SharedModule],
  declarations: [AccountProfileCompanyPageComponent, AccountProfileCompanyPageContainerComponent],
})
export class AccountProfileCompanyPageModule {}
