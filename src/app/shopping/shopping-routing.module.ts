import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from '../shared/feature-toggle/guards/feature-toggle.guard';

const routes: Routes = [
  { path: 'home', loadChildren: './containers/home-page/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: './containers/error-page/error-page.module#ErrorPageModule' },
  { path: 'product', loadChildren: './containers/product-page/product-page.module#ProductPageModule' },
  { path: 'category', loadChildren: './containers/category-page/category-page.module#CategoryPageModule' },
  {
    path: 'compare',
    loadChildren: './containers/compare-page/compare-page.module#ComparePageModule',
    canActivate: [FeatureToggleGuard],
    data: { feature: 'compare' },
  },
  {
    path: 'recently',
    loadChildren: './containers/recently-page/recently-page.module#RecentlyPageModule',
    canActivate: [FeatureToggleGuard],
    data: { feature: 'recently' },
  },
  { path: 'search', loadChildren: './containers/search-page/search-page.module#SearchPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingRoutingModule {}
