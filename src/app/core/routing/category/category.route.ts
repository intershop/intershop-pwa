import { UrlMatchResult, UrlSegment } from '@angular/router';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Category } from 'ish-core/models/category/category.model';
import { CoreState } from 'ish-core/store/core/core-store';
import { selectRouteParam, selectRouteParamAorB } from 'ish-core/store/core/router';
import { reservedCharactersRegEx } from 'ish-core/utils/routing';

export function generateLocalizedCategorySlug(category: Category) {
  return (
    category?.name
      ?.replace(reservedCharactersRegEx, '-')
      .replace(/-+/g, '-')
      .replace(/-+$/, '')
      .replace('-cat', '-Cat') || ''
  );
}

const categoryRouteFormat = /^\/(?!category|categoryref\/.*$)(.*-)?cat(.*)$/;

export function matchCategoryRoute(segments: UrlSegment[]): UrlMatchResult {
  // compatibility to old routes
  if (segments && segments.length === 2 && (segments[0].path === 'category' || segments[0].path === 'categoryref')) {
    return { consumed: [] };
  }

  const url = `/${segments.map(s => s.path).join('/')}`;
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

export function generateCategoryUrl(category: Category): string {
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

export function ofCategoryUrl(): MonoTypeOperatorFunction<{}> {
  return source$ =>
    source$.pipe(
      filter(
        (state: CoreState) =>
          !selectRouteParam('sku')(state) && !!selectRouteParamAorB('categoryUniqueId', 'categoryRefId')(state)
      )
    );
}
