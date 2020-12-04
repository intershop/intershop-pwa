import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'organizations',
    loadChildren: () => import('./organizations/organizations-page.module').then(m => m.OrganizationsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationHierarchiesRoutingModule {}
