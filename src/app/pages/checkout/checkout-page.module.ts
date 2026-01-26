import { Routes } from '@angular/router';
import { FORMLY_CONFIG } from '@ngx-formly/core';

import { noServerSideRenderingGuard } from 'ish-core/guards/no-server-side-rendering.guard';

import { checkoutReviewFormlyConfig } from '../checkout-review/checkout-review/checkout-review.component';

import { checkoutPageGuard } from './checkout-page.guard';

export const checkoutChildRoutes: Routes = [
  {
    path: 'address',
    canActivate: [checkoutPageGuard],
    loadComponent: () =>
      import('../checkout-address/checkout-address-page.component').then(c => c.CheckoutAddressPageComponent),
    data: {
      checkoutStep: 1,
      meta: {
        title: 'checkout.addresses.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'shipping',
    canActivate: [checkoutPageGuard],
    loadComponent: () =>
      import('../checkout-shipping/checkout-shipping-page.component').then(c => c.CheckoutShippingPageComponent),
    data: {
      checkoutStep: 2,
      meta: {
        title: 'checkout.shipping.pagetitle',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'payment',
    canActivate: [checkoutPageGuard],
    loadComponent: () =>
      import('../checkout-payment/checkout-payment-page.component').then(c => c.CheckoutPaymentPageComponent),
    data: {
      checkoutStep: 3,
      meta: {
        title: 'checkout.payment.pagetitle',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'review',
    canActivate: [checkoutPageGuard],
    loadComponent: () =>
      import('../checkout-review/checkout-review-page.component').then(c => c.CheckoutReviewPageComponent),
    data: {
      checkoutStep: 4,
      meta: {
        title: 'checkout.progress.review.label',
        robots: 'noindex, nofollow',
      },
    },
    providers: [{ provide: FORMLY_CONFIG, useValue: checkoutReviewFormlyConfig, multi: true }],
  },
  {
    path: 'receipt',
    loadComponent: () =>
      import('../checkout-receipt/checkout-receipt-page.component').then(c => c.CheckoutReceiptPageComponent),
    data: {
      checkoutStep: 5,
      meta: {
        title: 'checkout.progress.receipt.label',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'address',
  },
];

export const checkoutPageRoutes: Routes = [
  {
    path: '',
    canActivate: [noServerSideRenderingGuard],
    loadComponent: () => import('./checkout-page.component').then(c => c.CheckoutPageComponent),
    data: {
      headerType: 'checkout',
      meta: {
        title: 'seo.title.checkout',
        robots: 'noindex, nofollow',
      },
    },
    children: checkoutChildRoutes,
  },
];
