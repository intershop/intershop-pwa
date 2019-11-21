import { UrlSegment } from '@angular/router';

import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';

function generateProductSlug(product: Product) {
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
  let productRoute = '/product/' + product.sku;
  const productSlug = generateProductSlug(product);
  if (productSlug) {
    productRoute += '/' + productSlug;
  }

  if (category) {
    productRoute = `/category/${category.uniqueId}${productRoute}`;
  } else {
    // TODO: add defaultCategory to route once this information is available with the products REST call
  }
  return productRoute;
}

/**
 * UrlMatcher for product route
 * Defines a specific URL format for the product page
 */
export function productRouteMatcher(url: UrlSegment[]) {
  // Format: product/:sku/:productSlug
  if (url[0].path === 'product') {
    return {
      posParams: {
        sku: url[1],
      },
      consumed: url,
    };
  }

  // Format: category/:categoryUniqueId/product/:sku/:productSlug
  if (url.length >= 4 && url[0].path === 'category' && url[2].path === 'product') {
    return {
      posParams: {
        categoryUniqueId: url[1],
        sku: url[3],
      },
      consumed: url,
    };
  }
}
