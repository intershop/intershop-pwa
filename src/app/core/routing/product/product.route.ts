import { UrlMatchResult, UrlSegment } from '@angular/router';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { generateLocalizedCategorySlug } from 'ish-core/routing/category/category.route';
import { CoreState } from 'ish-core/store/core/core-store';
import { selectRouteParam } from 'ish-core/store/core/router';
import { reservedCharactersRegEx } from 'ish-core/utils/routing';

function generateProductSlug(product: ProductView) {
  if (!product || !product.name) {
    return;
  }

  let slug = product.name.replace(reservedCharactersRegEx, '-').replace(/-+/g, '-').replace(/-+$/, '');

  if (ProductHelper.isVariationProduct(product) && product.variableVariationAttributes) {
    slug += '-';
    slug += product.variableVariationAttributes
      .map(att => att.value)
      .filter(val => typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number')
      .map(val => val.toString().replace(reservedCharactersRegEx, '-'))
      .join('-')
      .replace(/-+/g, '-');
  }

  return slug;
}

const productRouteFormat = new RegExp('^/(.*)?sku(.*?)(-cat(.*))?$');

export function matchProductRoute(segments: UrlSegment[]): UrlMatchResult {
  // compatibility to old routes
  const isSimpleProduct = segments && segments.length > 0 && segments[0].path === 'product';
  const isContextProduct =
    segments && segments.length > 2 && segments[0].path === 'category' && segments[2].path === 'product';
  if (isSimpleProduct || isContextProduct) {
    return { consumed: [] };
  }

  const url = '/' + segments.map(s => s.path).join('/');
  if (productRouteFormat.test(url)) {
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

export function generateProductUrl(product: ProductView, category?: Category): string {
  if (!product || !product.sku) {
    return '/';
  }

  let route = '/';

  const contextCategory = category || product?.defaultCategory;
  if (contextCategory) {
    route += generateLocalizedCategorySlug(contextCategory);
    route += '/';
  }

  if (product?.name) {
    route += `${generateProductSlug(product)}-`;
  }

  route += `sku${product.sku}`;

  if (contextCategory) {
    route += `-cat${contextCategory.uniqueId}`;
  }

  return route;
}

export function ofProductUrl(): MonoTypeOperatorFunction<{}> {
  return source$ => source$.pipe(filter((state: CoreState) => !!selectRouteParam('sku')(state)));
}
