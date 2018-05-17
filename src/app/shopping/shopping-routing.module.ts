import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: './containers/home-page/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: './containers/error-page/error-page.module#ErrorPageModule' },
  { path: 'product', loadChildren: './containers/product-page/product-page.module#ProductPageModule' },
  { path: 'category', loadChildren: './containers/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: './containers/compare-page/compare-page.module#ComparePageModule' },
  { path: 'recently', loadChildren: './containers/recently-page/recently-page.module#RecentlyPageModule' },
  { path: 'search', loadChildren: './containers/search-page/search-page.module#SearchPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingRoutingModule {}
