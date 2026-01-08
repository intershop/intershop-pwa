import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormlyCustomerAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-customer-address-form/formly-customer-address-form.component';
import { SharedModule } from 'ish-shared/shared.module';

import { AccountAddressesPageComponent } from './account-addresses-page.component';
import { AccountAddressesComponent } from './account-addresses/account-addresses.component';

const routes: Routes = [{ path: '', component: AccountAddressesPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), FormlyCustomerAddressFormComponent, SharedModule],
  declarations: [AccountAddressesComponent, AccountAddressesPageComponent],
})
export class AccountAddressesPageModule {}
