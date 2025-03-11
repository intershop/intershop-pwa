import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCentersPageComponent } from './cost-centers-page.component';
import { CostCentersSelectManagersFieldComponent } from './formly/cost-centers-select-managers-field/cost-centers-select-managers-field.component';

const costCentersPageRoutes: Routes = [{ path: '', component: CostCentersPageComponent }];

const costCentersFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-cost-centers-select-managers-field',
      component: CostCentersSelectManagersFieldComponent,
      wrappers: ['form-field-horizontal', 'validation'],
    },
  ],
};

@NgModule({
  imports: [
    OrganizationManagementModule,
    FormlyModule.forChild(costCentersFormlyConfig),
    RouterModule.forChild(costCentersPageRoutes),
    SharedModule,
  ],
  declarations: [CostCentersPageComponent, CostCentersSelectManagersFieldComponent],
})
export class CostCentersPageModule {}
