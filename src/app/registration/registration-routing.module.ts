import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutGuard } from '../core/guards/logout.guard';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: 'app/registration/containers/registration-page/registration-page.module#RegistrationPageModule',
  },
  { path: 'login', loadChildren: 'app/registration/containers/login-page/login-page.module#LoginPageModule' },
  {
    path: 'logout',
    loadChildren: 'app/shopping/containers/home-page/home-page.module#HomePageModule',
    canActivate: [LogoutGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [LogoutGuard],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
