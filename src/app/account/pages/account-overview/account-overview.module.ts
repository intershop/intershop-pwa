import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountOverviewComponent } from './account-overview.component';
import { AccountOverviewRoute } from './account-overview.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccountOverviewRoute)
  ],
  declarations: [AccountOverviewComponent]
})

export class AccountOverviewModule {

}
