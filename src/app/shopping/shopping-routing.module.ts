import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'category', loadChildren: 'app/shopping/pages/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: 'app/shopping/pages/compare-page/compare-page.module#ComparePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class ShoppingRoutingModule { }
