import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
  {
    path: ':PunchoutLogin',
    loadChildren: () =>
      import('./account-punchout-details/account-punchout-details-page.module').then(
        m => m.AccountPunchoutDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PunchoutAccountRoutingModule {}
