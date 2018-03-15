import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountShareModule } from '../../account-share.module';
import { ProfileSettingsPageComponent } from '../../components/profile-settings-page/profile-settings-page.component';
import { ProfileSettingsPageContainerComponent } from './profile-settings-page.container';
import { profileSettingsPageRoutes } from './profile-settings-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(profileSettingsPageRoutes),
    SharedModule,
    AccountShareModule
  ],
  declarations: [
    ProfileSettingsPageComponent,
    ProfileSettingsPageContainerComponent,
  ]
})

export class ProfileSettingsPageModule { }
