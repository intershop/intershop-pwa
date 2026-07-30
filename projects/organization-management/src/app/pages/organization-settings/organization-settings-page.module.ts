import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { OrganizationSettingsPageComponent } from './organization-settings-page.component';

const organizationSettingsPageRoutes: Routes = [{ path: '', component: OrganizationSettingsPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(organizationSettingsPageRoutes), SharedModule],
  declarations: [OrganizationSettingsPageComponent],
})
export class OrganizationSettingsPageModule {}
