import { UrlMatchResult, UrlSegment } from '@angular/router';
import { MonoTypeOperatorFunction, filter } from 'rxjs';

import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { CoreState } from 'ish-core/store/core/core-store';
import { selectRouteParam } from 'ish-core/store/core/router';
import { sanitizeSlugData } from 'ish-core/utils/routing';

/**
 * generate a localized content page slug
 *
 * @param page content page element for slug
 * @returns localized, formatted content page slug
 */
function generateLocalizedContentPageSlug(page: ContentPageTreeElement) {
  return sanitizeSlugData(page?.name);
}

// matcher to check if a given url is a content page route
const contentRouteFormat = /^\/(?!page\/.*$)(.*-)?pg(.*)$/;

/**
 * check if given url is a content page route
 *
 * @param segments current url segments
 * @returns match result if given url is a content page route or not
 */
export function matchContentRoute(segments: UrlSegment[]): UrlMatchResult {
  // compatibility to old routes
  if (segments && segments.length === 2 && segments[0].path === 'page') {
    return {
      consumed: [],
    };
  }

  const url = `/${segments.map(s => s.path).join('/')}`;
  if (contentRouteFormat.test(url)) {
    const match = contentRouteFormat.exec(url);
    const posParams: { [id: string]: UrlSegment } = {};
    if (match[2]) {
      posParams.contentPageId = new UrlSegment(match[2], {});
    }
    return {
      consumed: [],
      posParams,
    };
  }
  return;
}

/**
 * generate a localized content page url from a content page
 *
 * @param page content page
 * @returns localized content page url
 */
export function generateContentPageUrl(page: ContentPageTreeView): string {
  if (!page) {
    return '/';
  }

  let route = '/';

  // generate for each path element from the given content page hierarchy a content page slug and join them together to a complete route
  route += page.pathElements?.map(p => generateLocalizedContentPageSlug(p)).join('/');

  // add to content page route the content page identifier
  if (route !== '/') {
    route += '-';
  }
  route += `pg${page.contentPageId}`;

  return route;
}

export function ofContentPageUrl(): MonoTypeOperatorFunction<{}> {
  return source$ => source$.pipe(filter((state: CoreState) => !!selectRouteParam('contentPageId')(state)));
}
