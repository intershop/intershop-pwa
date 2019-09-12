import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfilePageContainerComponent } from './account-profile-page.container';
import { AccountProfilePageComponent } from './components/account-profile-page/account-profile-page.component';

const routes: Routes = [
  { path: '', component: AccountProfilePageContainerComponent },
  {
    path: 'email',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_email.breadcrumb' },
      ],
    },
    loadChildren: '../account-profile-email/account-profile-email-page.module#AccountProfileEmailPageModule',
  },
  {
    path: 'password',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_password.breadcrumb' },
      ],
    },
    loadChildren: '../account-profile-password/account-profile-password-page.module#AccountProfilePasswordPageModule',
  },
  {
    path: 'user',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_profile.breadcrumb' },
      ],
    },
    loadChildren: '../account-profile-user/account-profile-user-page.module#AccountProfileUserPageModule',
  },
  {
    path: 'company',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.company_profile.heading' },
      ],
    },
    loadChildren: '../account-profile-company/account-profile-company-page.module#AccountProfileCompanyPageModule',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfilePageComponent, AccountProfilePageContainerComponent],
})
export class AccountProfilePageModule {}
