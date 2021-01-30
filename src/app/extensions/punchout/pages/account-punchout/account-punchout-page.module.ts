import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutPageComponent } from './account-punchout-page.component';

const accountPunchoutPageRoutes: Routes = [{ path: '', component: AccountPunchoutPageComponent }];

@NgModule({
  imports: [PunchoutModule, RouterModule.forChild(accountPunchoutPageRoutes)],
  declarations: [AccountPunchoutPageComponent],
})
export class AccountPunchoutPageModule {}
