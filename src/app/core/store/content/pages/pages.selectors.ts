import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { createContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-view.model';
import { generateContentPageUrl } from 'ish-core/routing/content-page/content-page.route';
import { getContentState } from 'ish-core/store/content/content-store';
import { getPageTree } from 'ish-core/store/content/page-tree';
import { selectRouteParam } from 'ish-core/store/core/router';

import { pagesAdapter } from './pages.reducer';

const getPagesState = createSelector(getContentState, state => state.pages);

const { selectEntities: getPageEntities } = pagesAdapter.getSelectors(getPagesState);

export const getContentPageLoading = createSelector(getPagesState, state => state.loading);

export const getSelectedContentPage = createSelector(getPageEntities, selectRouteParam('contentPageId'), (pages, id) =>
  createContentPageletEntryPointView(pages[id])
);

export const getBreadcrumbForContentPage = (rootId: string) =>
  createSelectorFactory<object, BreadcrumbItem[]>(projector => resultMemoize(projector, isEqual))(
    getSelectedContentPage,
    getPageTree,
    (contentPage: ContentPageletEntryPointView, pagetree: ContentPageTree) => {
      // set default breadcrumb data: just the selected content page name
      let breadcrumbData = [{ key: contentPage?.displayName }] as BreadcrumbItem[];
      // initialize root flag (no root yet)
      let gotRoot = false;

      // if 'COMPLETE' is used as rootId the complete available page path is returned as breadcrumb data
      // (in case we have no explicit root information but the full path is wanted)
      if (rootId === 'COMPLETE') {
        gotRoot = true;
        breadcrumbData = [];
      }

      // determine if pagetree information is available for the selected content page
      if (pagetree.nodes[contentPage?.id]) {
        pagetree.nodes[contentPage.id].path.forEach((item, i, path) => {
          // check if we are at the wanted path element for the root
          if (item === rootId) {
            gotRoot = true;
            breadcrumbData = [];
          }
          // push breadcrumb data once we have a root
          if (gotRoot) {
            breadcrumbData.push({
              key: pagetree.nodes[item].name,
              link:
                i !== path.length - 1
                  ? generateContentPageUrl(createContentPageTreeView(pagetree, item, item))
                  : undefined,
            });
          }
        });
      }
      return breadcrumbData;
    }
  );
