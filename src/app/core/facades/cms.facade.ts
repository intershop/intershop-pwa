import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { getContentInclude, loadContentInclude } from 'ish-core/store/content/includes';
import { getContentPagelet } from 'ish-core/store/content/pagelets';
import { getContentPageLoading, getSelectedContentPage } from 'ish-core/store/content/pages';
import { getViewContext, loadViewContextEntrypoint } from 'ish-core/store/content/viewcontexts';
import { getPGID } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';
import { SfeMapper } from 'ish-shared/cms/sfe-adapter/sfe.mapper';

@Injectable({ providedIn: 'root' })
export class CMSFacade {
  contentPage$ = this.store.pipe(select(getSelectedContentPage));
  contentPageLoading$ = this.store.pipe(select(getContentPageLoading));

  constructor(private store: Store, private sfeAdapter: SfeAdapterService) {}

  contentInclude$(includeId$: Observable<string>) {
    return combineLatest([includeId$.pipe(whenTruthy()), this.store.pipe(select(getPGID))]).pipe(
      tap(([includeId]) => this.store.dispatch(loadContentInclude({ includeId }))),
      switchMap(([includeId]) => this.store.pipe(select(getContentInclude(includeId), whenTruthy())))
    );
  }

  contentIncludeSfeMetadata$(includeId: string) {
    return this.store.pipe(select(getContentInclude(includeId))).pipe(
      filter(() => this.sfeAdapter.isInitialized()),
      whenTruthy(),
      map(include => SfeMapper.mapIncludeViewToSfeMetadata(include))
    );
  }

  pagelet$(id: string) {
    return this.store.pipe(select(getContentPagelet(id)));
  }

  viewContext$(viewContextId: string, callParameters: CallParameters) {
    this.store.dispatch(loadViewContextEntrypoint({ viewContextId, callParameters }));
    return this.store.pipe(select(getViewContext(viewContextId, callParameters)));
  }
}
