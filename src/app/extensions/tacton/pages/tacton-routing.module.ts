import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'configure',
    loadChildren: () => import('./configure/configure-page.module').then(m => m.ConfigurePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TactonRoutingModule {}
