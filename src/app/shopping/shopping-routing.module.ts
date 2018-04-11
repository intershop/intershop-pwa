import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: 'app/shopping/containers/home-page/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: 'app/shopping/containers/error-page/error-page.module#ErrorPageModule' },
  { path: 'product', loadChildren: 'app/shopping/containers/product-page/product-page.module#ProductPageModule' },
  { path: 'category', loadChildren: 'app/shopping/containers/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: 'app/shopping/containers/compare-page/compare-page.module#ComparePageModule' },
  { path: 'recently', loadChildren: 'app/shopping/containers/recently-page/recently-page.module#RecentlyPageModule' },
  { path: 'search', loadChildren: 'app/shopping/containers/search-page/search-page.module#SearchPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingRoutingModule {}
