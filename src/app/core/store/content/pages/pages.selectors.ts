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

export const getBreadcrumbForContentPage = createSelectorFactory<object, BreadcrumbItem[]>(projector =>
  resultMemoize(projector, isEqual)
)(getPageTree, getSelectedContentPage, (pagetree: ContentPageTree, contentPage: ContentPageletEntryPointView) =>
  pagetree.nodes[contentPage?.id]
    ? (pagetree.nodes[contentPage.id].path.map((item, i, path) => ({
        key: pagetree.nodes[item].name,
        link:
          i !== path.length - 1 ? generateContentPageUrl(createContentPageTreeView(pagetree, item, item)) : undefined,
      })) as BreadcrumbItem[])
    : ([{ key: contentPage?.displayName }] as BreadcrumbItem[])
);
