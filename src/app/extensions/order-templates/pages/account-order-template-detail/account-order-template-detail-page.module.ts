import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplatesModule } from '../../order-templates.module';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';
import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail-page.component';

const accountOrderTemplateDetailPageRoutes: Routes = [
  {
    path: '',
    component: AccountOrderTemplateDetailPageComponent,
  },
];

@NgModule({
  declarations: [AccountOrderTemplateDetailLineItemComponent, AccountOrderTemplateDetailPageComponent],
  imports: [OrderTemplatesModule, RouterModule.forChild(accountOrderTemplateDetailPageRoutes), SharedModule],
})
export class AccountOrderTemplateDetailPageModule {}
