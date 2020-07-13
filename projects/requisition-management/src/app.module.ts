import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'ish-core/core.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';
import { LogoutGuard } from 'ish-core/guards/logout.guard';
import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    CoreModule,
    FormsSharedModule,
    NoopAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'logout',
        canActivate: [LogoutGuard],
        component: LoginComponent,
      },
      {
        path: 'requisition-management',
        loadChildren: () => import('./app/requisition-management.module').then(m => m.RequisitionManagementModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: '**',
        redirectTo: 'requisition-management',
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
