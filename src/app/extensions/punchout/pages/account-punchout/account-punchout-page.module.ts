import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { PunchoutModule } from '../../punchout.module';

import { AccountPunchoutHeaderComponent } from './account-punchout-header/account-punchout-header.component';
import { AccountPunchoutPageComponent } from './account-punchout-page.component';

const accountPunchoutPageRoutes: Routes = [{ path: '', component: AccountPunchoutPageComponent }];

@NgModule({
  declarations: [AccountPunchoutHeaderComponent, AccountPunchoutPageComponent],
  imports: [NgbNavModule, PunchoutModule, RouterModule.forChild(accountPunchoutPageRoutes)],
})
export class AccountPunchoutPageModule {}
