import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: 'app/shopping/pages/home-page/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: 'app/shopping/pages/error-page/error-page.module#ErrorPageModule' },
  { path: 'product', loadChildren: 'app/shopping/pages/product-page/product-page.module#ProductPageModule' },
  { matcher: matchProductWithCategory, loadChildren: 'app/shopping/pages/product-page/product-page.module#ProductPageModule' },
  { path: 'category', loadChildren: 'app/shopping/pages/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: 'app/shopping/pages/compare-page/compare-page.module#ComparePageModule' }
];

export function matchProductWithCategory(segments: UrlSegment[]) {
  // if the route is a 'product' route within a 'category' context, e.g. /category/Home-Entertainment/220/1584/product/8806086011815
  if (segments.length > 0 && segments[0].path === 'category' && segments.map(segment => segment.path).includes('product')) {
    // return the route without the 'category' segment
    return { consumed: [segments[0]] };
  }
  return null;
}

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class ShoppingRoutingModule { }
