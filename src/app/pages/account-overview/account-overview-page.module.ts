import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageComponent } from './account-overview-page.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AccountOverviewComponent, AccountOverviewPageComponent],
})
export class AccountOverviewPageModule {
  static component = AccountOverviewPageComponent;
}
