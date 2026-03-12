import { Routes } from '@angular/router';

import { notFoundStatusGuard } from 'ish-core/guards/not-found-status.guard';
import { matchCategoryRoute } from 'ish-core/routing/category/category.route';
import { matchContentRoute } from 'ish-core/routing/content-page/content-page.route';
import { matchProductRoute } from 'ish-core/routing/product/product.route';

export const appLastRoutes: Routes = [
  // Legacy routes for backwards compatibility
  {
    path: 'product/:sku',
    data: { legacy: true, preload: 'eager' },
    loadChildren: () =>
      Promise.all([import('./product/product-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ ProductPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: ProductPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
  },
  {
    path: 'category/:categoryUniqueId/product/:sku',
    data: { legacy: true, preload: 'eager' },
    loadChildren: () =>
      Promise.all([import('./product/product-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ ProductPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: ProductPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
  },
  {
    path: 'category/:categoryUniqueId',
    loadChildren: () =>
      Promise.all([import('./category/category-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ CategoryPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: CategoryPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
    data: { legacy: true, preload: 'eager' },
  },
  {
    path: 'categoryref/:categoryRefId',
    loadChildren: () =>
      Promise.all([import('./category/category-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ CategoryPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: CategoryPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
    data: { legacy: true },
  },
  {
    path: 'page/:contentPageId',
    loadChildren: () =>
      Promise.all([import('./content/content-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ ContentPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: ContentPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
    data: { legacy: true },
  },
  // SEO-friendly routes using matchers
  {
    matcher: matchProductRoute,
    data: { preload: 'eager' },
    loadChildren: () =>
      Promise.all([import('./product/product-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ ProductPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: ProductPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
  },
  {
    matcher: matchCategoryRoute,
    loadChildren: () =>
      Promise.all([import('./category/category-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ CategoryPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: CategoryPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
    data: { preload: 'eager' },
  },
  {
    matcher: matchContentRoute,
    loadChildren: () =>
      Promise.all([import('./content/content-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ ContentPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: ContentPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
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

