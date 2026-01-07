import { Routes } from '@angular/router';

import { notFoundStatusGuard } from 'ish-core/guards/not-found-status.guard';
import { matchCategoryRoute } from 'ish-core/routing/category/category.route';
import { matchContentRoute } from 'ish-core/routing/content-page/content-page.route';
import { matchProductRoute } from 'ish-core/routing/product/product.route';

export const appLastRoutes: Routes = [
  // Legacy routes for backwards compatibility
  {
    path: 'product/:sku',
    loadComponent: () => import('./product/product-page.component').then(c => c.ProductPageComponent),
    data: { legacy: true, preload: 'eager' },
  },
  {
    path: 'category/:categoryUniqueId/product/:sku',
    loadComponent: () => import('./product/product-page.component').then(c => c.ProductPageComponent),
    data: { legacy: true, preload: 'eager' },
  },
  {
    path: 'category/:categoryUniqueId',
    loadComponent: () => import('./category/category-page.component').then(c => c.CategoryPageComponent),
    data: { legacy: true, preload: 'eager' },
  },
  {
    path: 'categoryref/:categoryRefId',
    loadComponent: () => import('./category/category-page.component').then(c => c.CategoryPageComponent),
    data: { legacy: true },
  },
  {
    path: 'page/:contentPageId',
    loadComponent: () => import('./content/content-page.component').then(c => c.ContentPageComponent),
    data: { legacy: true },
  },
  // SEO-friendly routes using matchers
  {
    matcher: matchProductRoute,
    loadComponent: () => import('./product/product-page.component').then(c => c.ProductPageComponent),
    data: { preload: 'eager' },
  },
  {
    matcher: matchCategoryRoute,
    loadComponent: () => import('./category/category-page.component').then(c => c.CategoryPageComponent),
    data: { preload: 'eager' },
  },
  {
    matcher: matchContentRoute,
    loadComponent: () => import('./content/content-page.component').then(c => c.ContentPageComponent),
    data: { preload: 'lazy' },
  },
  // Fallback route for 404
  {
    path: '**',
    canActivate: [notFoundStatusGuard],
    loadComponent: () => import('./error/error-page.component').then(c => c.ErrorPageComponent),
    data: {
      meta: {
        title: 'seo.title.error',
        robots: 'noindex, nofollow',
      },
    },
  },
];
