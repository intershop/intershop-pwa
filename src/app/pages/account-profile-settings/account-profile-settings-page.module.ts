import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AccountProfileSettingsPageContainerComponent } from './account-profile-settings-page.container';
import { AccountProfileSettingsPageComponent } from './components/account-profile-settings-page/account-profile-settings-page.component';

const orderPageRoutes: Routes = [{ path: '', component: AccountProfileSettingsPageContainerComponent }];
@NgModule({
  imports: [RouterModule.forChild(orderPageRoutes), SharedModule],
  declarations: [AccountProfileSettingsPageComponent, AccountProfileSettingsPageContainerComponent],
})
export class AccountProfileSettingsPageModule {}
