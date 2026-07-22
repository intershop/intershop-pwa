import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationSettingsCompanyPageComponent } from './organization-settings-company-page.component';
import { OrganizationSettingsCompanyComponent } from './organization-settings-company/organization-settings-company.component';

const organizationSettingsCompanyPageRoutes: Routes = [
  { path: '', component: OrganizationSettingsCompanyPageComponent },
];

@NgModule({
  declarations: [OrganizationSettingsCompanyComponent, OrganizationSettingsCompanyPageComponent],
  imports: [RouterModule.forChild(organizationSettingsCompanyPageRoutes), SharedModule],
})
export class OrganizationSettingsCompanyPageModule {}
