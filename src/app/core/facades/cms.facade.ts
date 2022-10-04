import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { CategoryHelper } from 'ish-core/models/category/category.helper';
import { getContentInclude, loadContentInclude } from 'ish-core/store/content/includes';
import { getContentPageTree, loadContentPageTree } from 'ish-core/store/content/page-tree';
import { getContentPagelet } from 'ish-core/store/content/pagelets';
import {
  getContentPageLoading,
  getSelectedContentPage,
  setBreadcrumbForContentPage,
} from 'ish-core/store/content/pages';
import { getParametersProductList, loadParametersProductListFilter } from 'ish-core/store/content/parameters';
import { getViewContext, loadViewContextEntrypoint } from 'ish-core/store/content/viewcontexts';
import { getPGID } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class CMSFacade {
  constructor(private store: Store) {}

  contentPage$ = this.store.pipe(select(getSelectedContentPage));
  contentPageLoading$ = this.store.pipe(select(getContentPageLoading));

  contentInclude$(includeId$: Observable<string>) {
    return combineLatest([includeId$.pipe(whenTruthy()), this.store.pipe(select(getPGID))]).pipe(
      delay(0), // delay ensures the apiToken cookie is deleted before a cms request without a pgid is triggered
      tap(([includeId]) => this.store.dispatch(loadContentInclude({ includeId }))),
      switchMap(([includeId]) => this.store.pipe(select(getContentInclude(includeId)), whenTruthy()))
    );
  }

  pagelet$(id: string) {
    return this.store.pipe(select(getContentPagelet(id)));
  }

  viewContext$(viewContextId: string, callParameters: CallParameters) {
    this.store.dispatch(loadViewContextEntrypoint({ viewContextId, callParameters }));
    return this.store.pipe(select(getViewContext(viewContextId, callParameters)));
  }

  contentPageTree$(rootId: string, depth: number) {
    this.store.dispatch(loadContentPageTree({ rootId, depth }));
    return this.store.pipe(select(getContentPageTree(rootId)));
  }

  /**
   *
   * @param rootId is taken into consideration as first element of breadcrumb for content page
   *
   * NOTE: use 'COMPLETE' as value of rootId to get complete available page path as breadcrumb
   */
  setBreadcrumbForContentPage(rootId: string): void {
    this.store.dispatch(setBreadcrumbForContentPage({ rootId }));
  }

  parameterProductListFilter$(categoryId?: string, productFilter?: string, scope?: string, amount?: number) {
    const listConfiguration = this.getProductListConfiguration(categoryId, productFilter, scope, amount);
    this.store.dispatch(
      loadParametersProductListFilter({
        id: listConfiguration.id,
        searchParameter: listConfiguration.searchParameter,
        amount,
      })
    );
    return this.store.pipe(select(getParametersProductList(listConfiguration.id)));
  }

  private getProductListConfiguration(
    categoryId?: string,
    productFilter?: string,
    scope?: string,
    amount?: number
  ): { id: string; searchParameter: URLFormParams } {
    let id = '';
    const searchParameter: URLFormParams = {};

    id = categoryId ? `${id}@${categoryId}` : id;
    id = productFilter ? `${id}@${productFilter}` : id;
    id = scope ? `${id}@${scope}` : id;
    id = amount ? `${id}@${amount}` : id;

    if (categoryId && scope !== 'GlobalScope') {
      searchParameter.category = [CategoryHelper.getCategoryPath(categoryId)];
    }

    searchParameter.productFilter = productFilter ? [productFilter] : ['fallback_searchquerydefinition'];

    return { id, searchParameter };
  }
}
