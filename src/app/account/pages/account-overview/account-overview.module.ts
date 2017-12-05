import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountOverviewComponent } from './account-overview.component';
import { accountOverviewRoutes } from './account-overview.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(accountOverviewRoutes)
  ],
  declarations: [AccountOverviewComponent]
})

export class AccountOverviewModule {

}
