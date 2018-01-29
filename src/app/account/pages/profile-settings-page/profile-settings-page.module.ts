import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountShareModule } from '../../account-share.module';
import { ProfileSettingsPageComponent } from './profile-settings-page.component';
import { profileSettingsPageRoutes } from './profile-settings-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(profileSettingsPageRoutes),
    SharedModule,
    AccountShareModule
  ],
  declarations: [
    ProfileSettingsPageComponent
  ]
})

export class ProfileSettingsPageModule { }
