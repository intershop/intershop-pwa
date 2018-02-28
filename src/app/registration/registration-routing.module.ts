import { Inject, NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { USE_SIMPLE_ACCOUNT } from '../core/configurations/injection-keys';
import { LogoutGuard } from '../core/guards/logout.guard';

const routes: Routes = [
  { path: 'register', loadChildren: 'app/registration/containers/registration-page/registration-page.module#RegistrationPageModule' },
  { path: 'login', loadChildren: 'app/registration/containers/login-page/login-page.module#LoginPageModule' },
  { path: 'logout', loadChildren: 'app/shopping/containers/home-page/home-page.module#HomePageModule', canActivate: [LogoutGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    LogoutGuard
  ],
  exports: [
    RouterModule
  ]
})

export class RegistrationRoutingModule {

  constructor(
    @Inject(USE_SIMPLE_ACCOUNT) useSimpleAccount: boolean,
    router: Router
  ) {
    if (useSimpleAccount) {
      const registerRoute: Route = router.config.find(r => r.path === 'register');
      registerRoute.loadChildren = 'app/registration/pages/login-page/login-page.module#LoginPageModule';
    }
  }
}
