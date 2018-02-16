import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: 'app/shopping/pages/home-page/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: 'app/shopping/pages/error-page/error-page.module#ErrorPageModule' },
  { path: 'product', loadChildren: 'app/shopping/containers/product-page/product-page.module#ProductPageModule' },
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
