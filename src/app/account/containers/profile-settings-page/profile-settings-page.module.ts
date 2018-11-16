import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { AccountSharedModule } from '../../account-shared.module';
import { ProfileSettingsPageComponent } from '../../components/profile-settings-page/profile-settings-page.component';

import { ProfileSettingsPageContainerComponent } from './profile-settings-page.container';
import { profileSettingsPageRoutes } from './profile-settings-page.routes';

@NgModule({
  imports: [AccountSharedModule, RouterModule.forChild(profileSettingsPageRoutes), SharedModule],
  declarations: [ProfileSettingsPageComponent, ProfileSettingsPageContainerComponent],
})
export class ProfileSettingsPageModule {}
