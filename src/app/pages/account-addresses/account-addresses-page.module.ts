import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountAddressesPageContainerComponent } from './account-addresses-page.container';
import { AccountAddressesComponent } from './components/account-addresses/account-addresses.component';

const routes: Routes = [{ path: '', component: AccountAddressesPageContainerComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountAddressesComponent, AccountAddressesPageContainerComponent],
})
export class AccountAddressesPageModule {}
