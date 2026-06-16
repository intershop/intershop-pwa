import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatesModule } from '../../order-templates.module';

import { AccountOrderTemplateAddToBasketDialogComponent } from './account-order-template-add-to-basket-dialog/account-order-template-add-to-basket-dialog.component';
import { AccountOrderTemplateListComponent } from './account-order-template-list/account-order-template-list.component';
import { AccountOrderTemplatePageComponent } from './account-order-template-page.component';

const accountOrderTemplatePageRoutes: Routes = [
  {
    path: '',
    component: AccountOrderTemplatePageComponent,
  },
];

@NgModule({
  declarations: [AccountOrderTemplateListComponent, AccountOrderTemplatePageComponent],
  imports: [OrderTemplatesModule, RouterModule.forChild(accountOrderTemplatePageRoutes), SharedModule],
})
export class AccountOrderTemplatePageModule {}
