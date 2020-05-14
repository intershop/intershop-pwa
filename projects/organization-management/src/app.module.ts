import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
        path: 'organization-management',
        loadChildren: () => import('./app/organization-management.module').then(m => m.OrganizationManagementModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
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
