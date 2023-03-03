import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'ish-core/core.module';
import { authGuard } from 'ish-core/guards/auth.guard';
import { identityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { AppComponent } from './app.component';
import { RequisitionManagementModule } from './app/requisition-management.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  exports: [SharedModule],
  imports: [
    BrowserModule,
    CoreModule,
    NoopAnimationsModule,
    RequisitionManagementModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'logout',
        canActivate: [identityProviderLogoutGuard],
        component: LoginComponent,
      },
      {
        path: 'requisition-management',
        loadChildren: () =>
          import('./app/pages/requisition-management-routing.module').then(m => m.RequisitionManagementRoutingModule),
        canActivate: [authGuard],
        canActivateChild: [authGuard],
      },
      {
        path: '**',
        redirectTo: 'requisition-management/buyer',
        pathMatch: 'full',
      },
    ]),
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
