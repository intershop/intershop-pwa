import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddressFormsSharedModule } from 'ish-shared/address-forms/address-forms.module';
import { SharedModule } from 'ish-shared/shared.module';

import { AccountAddressesPageContainerComponent } from './account-addresses-page.container';
import { AccountAddressesPageComponent } from './components/account-addresses-page/account-addresses-page.component';

const routes: Routes = [{ path: '', component: AccountAddressesPageContainerComponent }];
@NgModule({
  imports: [AddressFormsSharedModule, RouterModule.forChild(routes), SharedModule],
  declarations: [AccountAddressesPageComponent, AccountAddressesPageContainerComponent],
})
export class AccountAddressesPageModule {}
