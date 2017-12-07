import { NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { GlobalConfiguration } from '../core/configurations/global.configuration';

const routes: Routes = [
  { path: 'login', loadChildren: 'app/registration/pages/account-login/account-login.module#AccountLoginModule' },
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
    globalConfiguration: GlobalConfiguration,
    router: Router
  ) {
    const settings = globalConfiguration.getApplicationSettings();
    if (settings.useSimpleAccount) {
      const registerRoute: Route = router.config.find(r => r.path === 'register');
      registerRoute.loadChildren = 'app/registration/pages/account-login/account-login.module#AccountLoginModule';
    }
  }
}
