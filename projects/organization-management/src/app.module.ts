import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'ish-core/core.module';
import { authGuard } from 'ish-core/guards/auth.guard';
import { identityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';

import { AppComponent } from './app.component';
import { routes as organizationManagementRoutes } from './app/pages/organization-management-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    NoopAnimationsModule,
    RouterModule.forRoot([
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
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
