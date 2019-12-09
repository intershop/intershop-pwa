import { Pipe, PipeTransform } from '@angular/core';

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

@Pipe({ name: 'ishProductRoute', pure: true })
export class ProductRoutePipe implements PipeTransform {
  transform(product: Product, category?: Category): string {
    return generateProductRoute(product, category);
  }
}
