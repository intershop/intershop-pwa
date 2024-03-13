import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./hierarchies/hierarchies-page.module').then(m => m.HierarchiesPageModule),
  },
  {
    path: 'create-group',
    loadChildren: () =>
      import('./hierarchies-create-group/hierarchies-create-group-page.module').then(
        m => m.HierarchiesCreateGroupPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HierarchiesAccountRoutingModule {}
