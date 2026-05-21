import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountAddressesPageComponent } from './account-addresses-page.component';
import { AccountAddressesComponent } from './account-addresses/account-addresses.component';

const routes: Routes = [{ path: '', component: AccountAddressesPageComponent }];

@NgModule({
  declarations: [AccountAddressesComponent, AccountAddressesPageComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class AccountAddressesPageModule {}
