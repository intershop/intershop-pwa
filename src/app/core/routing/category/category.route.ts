import { UrlMatchResult, UrlSegment } from '@angular/router';
import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { CoreState } from 'ish-core/store/core/core-store';
import { selectRouteParam, selectRouteParamAorB } from 'ish-core/store/core/router';
import { sanitizeSlugData } from 'ish-core/utils/routing';

/**
 * generate a localized category slug
 *
 * @param category category element for slug
 * @returns localized, formatted category slug
 */
export function generateLocalizedCategorySlug(category: Category) {
  return sanitizeSlugData(category?.name);
}

// matcher to check if a given url is a category route
const categoryRouteFormat = /^\/(?!category|categoryref\/.*$)(.*?)-?ctg(.*)$/;

/**
 * check if given url is a category route
 *
 * @param segments current url segments
 * @returns match result if given url is a category route or not
 */
export function matchCategoryRoute(segments: UrlSegment[]): UrlMatchResult {
  // compatibility to old routes
  if (segments && segments.length === 2 && (segments[0].path === 'category' || segments[0].path === 'categoryref')) {
    return { consumed: [] };
  }

  // generate complete url path
  const url = `/${segments.map(s => s.path).join('/')}`;

  // check that complete url path is a category route
  if (categoryRouteFormat.test(url)) {
    // select categoryUniqueId to render a category component
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

/**
 * generate a localized category url from a category view
 *
 * @param category category view
 * @returns localized category url
 */
export function generateCategoryUrl(category: CategoryView): string {
  if (!category) {
    return '/';
  }

  // generate for each path element from the given category view a category slug and join them together to a complete route
  let route = `/${category.pathElements
    ?.filter(x => !!x)
    .map(el => generateLocalizedCategorySlug(el))
    .join('/')}`;

  // add to category route the category identifier
  if (route !== '/') {
    route += '-';
  }

  route += `ctg${category.uniqueId}`;

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
