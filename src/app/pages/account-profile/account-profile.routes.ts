import { Routes } from '@angular/router';

import { AccountProfilePageComponent } from './account-profile-page.component';
import { fetchUserNewsletterGuard } from './fetch-user-newsletter.guard';

export const accountProfileRoutes: Routes = [
  { path: '', canActivate: [fetchUserNewsletterGuard], component: AccountProfilePageComponent },
  {
    path: 'email',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_email.breadcrumb' },
      ],
    },
    loadComponent: () =>
      import('../account-profile-email/account-profile-email-page.component').then(
        m => m.AccountProfileEmailPageComponent
      ),
  },
  {
    path: 'password',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_password.breadcrumb' },
      ],
    },
    loadComponent: () =>
      import('../account-profile-password/account-profile-password-page.component').then(
        m => m.AccountProfilePasswordPageComponent
      ),
  },
  {
    path: 'user',
    data: {
      breadcrumbData: [
        { key: 'account.profile.link', link: '/account/profile' },
        { key: 'account.update_profile.breadcrumb' },
      ],
    },
    loadComponent: () =>
      import('../account-profile-user/account-profile-user-page.component').then(
        m => m.AccountProfileUserPageComponent
      ),
  },
];
