import { Routes } from '@angular/router';

import { authGuard } from 'ish-core/guards/auth.guard';
import { identityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';

import { routes as organizationManagementRoutes } from './app/pages/organization-management-routing.module';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login.component').then(m => m.LoginComponent),
  },
  {
    path: 'logout',
    canActivate: [identityProviderLogoutGuard],
    loadComponent: () => import('./login.component').then(m => m.LoginComponent),
  },
  {
    path: 'organization-management',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: organizationManagementRoutes,
  },
  {
    path: '**',
    redirectTo: 'organization-management',
    pathMatch: 'full',
  },
];
