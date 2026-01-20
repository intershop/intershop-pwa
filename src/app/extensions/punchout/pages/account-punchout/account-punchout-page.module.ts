import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPunchoutPageComponent } from './account-punchout-page.component';

const accountPunchoutPageRoutes: Routes = [{ path: '', component: AccountPunchoutPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(accountPunchoutPageRoutes)],
})
export class AccountPunchoutPageModule {}
