import { UrlMatchResult, UrlSegment } from '@angular/router';
import { RouteNavigation, ofRoute } from 'ngrx-router';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

function generateProductSlug(product: ProductView) {
  if (!product || !product.name) {
    return;
  }

  let slug = product.name.replace(/ /g, '-').replace(/-+$/g, '');

  if (ProductHelper.isVariationProduct(product)) {
    slug += '-';
    slug += product.variableVariationAttributes
      .map(att => att.value)
      .filter(val => typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number')
      .join('-');
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

export function generateProductUrl(product: ProductView, category?: CategoryView): string {
  const contextCategory = category || (product && product.defaultCategory());

  if (!(product && product.sku)) {
    return '/';
  }

  let route = '/';

  if (contextCategory) {
    route += contextCategory
      .pathCategories()
      .map(cat => cat.name.replace(/ /g, '-'))
      .join('/');
    route += '/';
  }

  if (product.name) {
    route += `${generateProductSlug(product)}-`;
  }

  route += `sku${product.sku}`;

  if (contextCategory) {
    route += `-cat${contextCategory.uniqueId}`;
  }

  return route;
}

export function ofProductRoute(): MonoTypeOperatorFunction<RouteNavigation> {
  return source$ =>
    source$.pipe(
      ofRoute(),
      filter(action => action.payload.params && action.payload.params.sku)
    );
}
