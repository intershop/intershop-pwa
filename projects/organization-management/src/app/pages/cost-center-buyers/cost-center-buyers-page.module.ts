import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterBuyersPageComponent } from './cost-center-buyers-page.component';
import { CostCenterBuyersRepeatFieldComponent } from './cost-center-buyers-repeat-field/cost-center-buyers-repeat-field.component';

const costCenterBuyersPageRoutes: Routes = [{ path: '', component: CostCenterBuyersPageComponent }];

const formlyConfig: ConfigOption = {
  types: [
    {
      name: 'repeatCostCenterBuyers',
      component: CostCenterBuyersRepeatFieldComponent,
    },
  ],
};

@NgModule({
  imports: [
    FormlyModule.forChild(formlyConfig),
    OrganizationManagementModule,
    RouterModule.forChild(costCenterBuyersPageRoutes),
    SharedModule,
  ],
  declarations: [CostCenterBuyersPageComponent, CostCenterBuyersRepeatFieldComponent],
})
export class CostCenterBuyersPageModule {}
