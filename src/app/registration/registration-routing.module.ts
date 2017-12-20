import { Inject, NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { USE_SIMPLE_ACCOUNT } from '../core/configurations/injection-keys';

const routes: Routes = [
  { path: 'login', loadChildren: 'app/registration/pages/login-page/login-page.module#LoginPageModule' },
  { path: 'register', loadChildren: 'app/registration/pages/registration-page/registration-page.module#RegistrationPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
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
