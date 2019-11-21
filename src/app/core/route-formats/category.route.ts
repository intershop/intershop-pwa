import { UrlSegment } from '@angular/router';

import { Category } from 'ish-core/models/category/category.model';

export function generateCategoryRoute(category: Category) {
  return '/category/' + category.uniqueId;
}

/**
 * UrlMatcher for category route
 * Defines a specific URL format for the category page
 */
export function categoryRouteMatcher(url: UrlSegment[]) {
  // Format: category/:categoryUniqueId
  if (url[0].path === 'category') {
    return {
      posParams: {
        categoryUniqueId: url[1],
      },
      consumed: url,
    };
  }
}
