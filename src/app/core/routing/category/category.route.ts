import { UrlMatchResult, UrlSegment } from '@angular/router';
import { RouteNavigation, ofRoute } from 'ngrx-router';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';

export function generateLocalizedCategorySlug(category: CategoryView) {
  if (!category || !category.categoryPath.length) {
    return '';
  }
  const lastCat = category.pathCategories()[category.categoryPath.length - 1].name;
  return lastCat ? lastCat.replace(/ /g, '-') : '';
}

const categoryRouteFormat = /^\/(?!category\/.*$)(.*-)?cat(.*)$/;

export function matchCategoryRoute(segments: UrlSegment[]): UrlMatchResult {
  // compatibility to old routes
  if (segments && segments.length === 2 && segments[0].path === 'category') {
    return { consumed: [] };
  }

  const url = '/' + segments.map(s => s.path).join('/');
  if (categoryRouteFormat.test(url)) {
    const match = categoryRouteFormat.exec(url);
    const posParams: { [id: string]: UrlSegment } = {};
    if (match[2]) {
      posParams.categoryUniqueId = new UrlSegment(match[2], {});
    }
    return {
      consumed: [],
      posParams,
    };
  }
  return;
}

export function generateCategoryUrl(category: CategoryView): string {
  if (!category) {
    return '/';
  }
  let route = '/';

  route += generateLocalizedCategorySlug(category);

  if (route !== '/') {
    route += '-';
  }

  route += `cat${category.uniqueId}`;

  return route;
}

export function ofCategoryRoute(): MonoTypeOperatorFunction<RouteNavigation> {
  return source$ =>
    source$.pipe(
      ofRoute(),
      filter(action => action.payload.params && action.payload.params.categoryUniqueId && !action.payload.params.sku)
    );
}
