import { UrlMatchResult, UrlSegment } from '@angular/router';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { generateLocalizedCategorySlug } from 'ish-core/routing/category/category.route';
import { CoreState } from 'ish-core/store/core/core-store';
import { selectRouteParam } from 'ish-core/store/core/router';
import { sanitizeSlugData } from 'ish-core/utils/routing';

/**
 * generate a localized product slug
 *
 * @param product product element for slug
 * @returns localized, formatted product slug
 */
function generateLocalizedProductSlug(product: ProductView) {
  if (!product) {
    return;
  }

  let slug = product.name || '';

  if (ProductHelper.isVariationProduct(product) && product.variableVariationAttributes) {
    slug += '-';
    slug += product.variableVariationAttributes
      .map(att => att.value)
      .filter(val => typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number')
      .map(val => val.toString())
      .join('-');
  }

  return sanitizeSlugData(slug);
}

// matcher to check if a given url is a product url
const productRouteFormat = /\/(?!ctg)(?!.*-ctg.*-prd)(.*?)-?prd(.*?)(-ctg(.*))?$/;

/**
 * check if a given url is a product url
 *
 * @param segments current url segments
 * @returns match result if given url is a product route or not
 */
export function matchProductRoute(segments: UrlSegment[]): UrlMatchResult {
  // compatibility to old routes
  const isSimpleProduct = segments && segments.length > 0 && segments[0].path === 'product';
  const isContextProduct = segments?.length > 2 && segments[0].path === 'category' && segments[2].path === 'product';
  if (isSimpleProduct || isContextProduct) {
    return { consumed: [] };
  }

  // generate complete url path
  const url = `/${segments.map(s => s.path).join('/')}`;

  // check that complete url path is a product route
  if (productRouteFormat.test(url)) {
    // select product sku and categoryUniqueId to render a product detail page
    const match = productRouteFormat.exec(url);
    const posParams: { [id: string]: UrlSegment } = {};
    if (match[4]) {
      posParams.categoryUniqueId = new UrlSegment(match[4], {});
    }
    if (match[2]) {
      posParams.sku = new UrlSegment(match[2], {});
    }
    return {
      consumed: [],
      posParams,
    };
  }
  return;
}

/**
 * generate a localized product url from a product view
 *
 * @param product product view
 * @param category optional category view
 * @returns localized product url
 */
export function generateProductUrl(product: ProductView, category?: CategoryView): string {
  if (!product?.sku) {
    return '/';
  }

  let route = '/';

  // get right category context for given product
  const contextCategory = category || product?.defaultCategory;

  // generate for each path element from the category context a category slug and join them together to a complete route
  if (contextCategory?.pathElements) {
    route += contextCategory?.pathElements.map(el => generateLocalizedCategorySlug(el)).join('/');
    route += '/';
  }

  // add product slug with product name to the route
  if (product?.name) {
    route += `${generateLocalizedProductSlug(product)}-`;
  }

  // sku and category identifier are added to the route
  route += `prd${product.sku}`;

  if (contextCategory) {
    route += `-ctg${contextCategory.uniqueId}`;
  }

  return route;
}

export function ofProductUrl(): MonoTypeOperatorFunction<{}> {
  return source$ => source$.pipe(filter((state: CoreState) => !!selectRouteParam('sku')(state)));
}
