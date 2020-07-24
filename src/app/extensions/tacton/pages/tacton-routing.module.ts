import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'configure',
    loadChildren: () => import('./configure/configure-page.module').then(m => m.ConfigurePageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TactonRoutingModule {}
