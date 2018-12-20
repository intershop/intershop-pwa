import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { AccountAddressesPageContainerComponent } from './account-addresses-page.container';
import { AccountAddressesPageComponent } from './components/account-addresses-page/account-addresses-page.component';

const routes: Routes = [{ path: '', component: AccountAddressesPageContainerComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountAddressesPageComponent, AccountAddressesPageContainerComponent],
})
export class AccountAddressesPageModule {}
