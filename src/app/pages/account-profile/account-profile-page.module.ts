import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountProfilePageComponent } from './account-profile-page.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { fetchUserNewsletterGuard } from './fetch-user-newsletter.guard';

const routes: Routes = [
  { path: '', canActivate: [fetchUserNewsletterGuard], component: AccountProfilePageComponent },
  {
    path: 'email',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_email.breadcrumb' },
      ],
    },
    loadChildren: () =>
      import('../account-profile-email/account-profile-email-page.module').then(m => m.AccountProfileEmailPageModule),
  },
  {
    path: 'password',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_password.breadcrumb' },
      ],
    },
    loadChildren: () =>
      import('../account-profile-password/account-profile-password-page.module').then(
        m => m.AccountProfilePasswordPageModule
      ),
  },
  {
    path: 'user',
    canActivate: [fetchUserNewsletterGuard],
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_profile.breadcrumb' },
      ],
    },
    loadChildren: () =>
      import('../account-profile-user/account-profile-user-page.module').then(m => m.AccountProfileUserPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AccountProfileComponent, AccountProfilePageComponent],
})
export class AccountProfilePageModule {}
