import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountContentPageComponent } from './account-content-page.component';

const accountContentPageRoutes: Routes = [
  {
    path: ':contentPageId',
    component: AccountContentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountContentPageRoutes), SharedModule],
  declarations: [AccountContentPageComponent],
})
export class AccountContentPageModule {}
