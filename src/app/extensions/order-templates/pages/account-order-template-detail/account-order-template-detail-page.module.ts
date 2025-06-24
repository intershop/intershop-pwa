import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';

import { TextInputFieldComponent } from 'ish-shared/formly/types/text-input-field/text-input-field.component';
import { TypesModule } from 'ish-shared/formly/types/types.module';
import { WrappersModule } from 'ish-shared/formly/wrappers/wrappers.module';
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
  imports: [
    OrderTemplatesModule,
    RouterModule.forChild(accountOrderTemplateDetailPageRoutes),
    SharedModule,
    TypesModule,
    WrappersModule,
    FormlyModule.forChild({
      types: [{ name: 'ish-text-input-field', component: TextInputFieldComponent }],
    }),
  ],
  declarations: [AccountOrderTemplateDetailLineItemComponent, AccountOrderTemplateDetailPageComponent],
})
export class AccountOrderTemplateDetailPageModule {}
