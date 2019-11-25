import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';

import { CustomRoute } from './custom-route';

export function generateProductSlug(product: Product) {
  return product && product.name ? product.name.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+$/g, '') : undefined;
}

/**
 * Generate a product detail route with optional category context.
 * @param product   The Product to genereate the route for
 * @param category  The optional Category that should be used as context for the product route
 * @returns         Product route string
 */
export function generateProductRoute(product: Product, category?: Category): string {
  if (!(product && product.sku)) {
    return '/';
  }
  let route = '/product/' + product.sku;
  const productSlug = generateProductSlug(product);
  if (productSlug) {
    route += '/' + productSlug;
  }

  if (category) {
    route = `/category/${category.uniqueId}${route}`;
  } else {
    // TODO: add defaultCategory to route once this information is available with the products REST call
  }
  return route;
}

/**
 * UrlMatcher for product route
 * Defines a specific URL format for the product page
 */

export function productRouteMatcher(url: UrlSegment[], _: UrlSegmentGroup, route: Route) {
  if (!route.data) {
    route.data = {};
  }

  // Format: product/:sku/:productSlug
  if (url[0].path === 'product') {
    route.data.format = 'product/:sku/:productSlug';
    return {
      posParams: {
        sku: url[1],
      },
      consumed: url,
    };
  }

  // Format: category/:categoryUniqueId/product/:sku/:productSlug
  if (url.length >= 4 && url[0].path === 'category' && url[2].path === 'product') {
    route.data.format = 'category/:categoryUniqueId/product/:sku/:productSlug';
    return {
      posParams: {
        categoryUniqueId: url[1],
        sku: url[3],
      },
      consumed: url,
    };
  }
}

export const productRoute: CustomRoute = {
  matcher: productRouteMatcher,
  generateUrl: generateProductRoute,
  formats: ['product/:sku/:productSlug', 'category/:categoryUniqueId/product/:sku/:productSlug'],
};
