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
  const productSlug = generateProductSlug(product);
  let productRoute = `p-${product.sku}.html`;
  if (productSlug) {
    productRoute = `${productSlug}-${productRoute}`;
  }

  if (category) {
    productRoute = `${category.uniqueId}-c/${productRoute}`;
  }

  return '/' + productRoute;
}

/**
 * UrlMatcher for product route
 * Defines a specific URL format for the product page
 */

export function productRouteMatcher(url: UrlSegment[]) {
  if (url.length && !url[url.length - 1].path.endsWith('.html')) {
    return;
  }

  let productPath = '';
  let categoryUniqueId;

  if (url.length === 1) {
    productPath = url[0].path;
  } else if (url.length === 2) {
    // Format: <categoryUniqueId>-c/<productSlug>-p-<sku>.html
    productPath = url[1].path;
    categoryUniqueId = url[0].path.slice(0, -2);
  }

  const productParts = productPath.slice(0, -5).split('-'); // remove '.html'
  let sku;

  // Format: p-<sku>.html
  if (productParts.length === 2 && productParts[0] === 'p') {
    sku = productParts[1];
  }

  // Format: <productSlug>-p-<sku>.html
  if (productParts.length >= 3 && [...productParts].splice(-2)[0] === 'p') {
    sku = [...productParts].splice(-1)[0];
  }

  const posParams: { [key: string]: UrlSegment } = {
    sku: new UrlSegment(sku, {}),
  };

  if (categoryUniqueId) {
    posParams.categoryUniqueId = new UrlSegment(categoryUniqueId, {});
  }

  return {
    posParams,
    consumed: url,
  };
}
