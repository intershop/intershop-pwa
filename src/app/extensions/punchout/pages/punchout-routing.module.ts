import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'punchout', loadChildren: () => import('./punchout/punchout-page.module').then(m => m.PunchoutPageModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PunchoutRoutingModule {}

// tslint:disable-next-line: project-structure
const accountRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account-punchout/account-punchout-page.module').then(m => m.AccountPunchoutPageModule),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./account-punchout-create/account-punchout-create-page.module').then(
        m => m.AccountPunchoutCreatePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountRoutes)],
  exports: [RouterModule],
})
// tslint:disable-next-line: project-structure
export class AccountPunchoutRoutingModule {}
