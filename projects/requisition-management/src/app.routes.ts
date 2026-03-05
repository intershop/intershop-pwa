import { Routes } from '@angular/router';

import { authGuard } from 'ish-core/guards/auth.guard';
import { identityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';

import { routes as requisitionManagementRoutes } from './app/pages/requisition-management.routes';

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
    path: 'requisition-management',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: requisitionManagementRoutes,
  },
  {
    path: '**',
    redirectTo: 'requisition-management/buyer',
    pathMatch: 'full',
  },
];
