import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfileCompanyPageContainerComponent } from './account-profile-company-page.container';
import { AccountProfileCompanyComponent } from './components/account-profile-company/account-profile-company.component';

const accountProfileCompanyPageRoutes: Routes = [{ path: '', component: AccountProfileCompanyPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(accountProfileCompanyPageRoutes), SharedModule],
  declarations: [AccountProfileCompanyComponent, AccountProfileCompanyPageContainerComponent],
})
export class AccountProfileCompanyPageModule {}
