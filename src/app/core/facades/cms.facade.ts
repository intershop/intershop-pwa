import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { LoadContentInclude, getContentInclude } from 'ish-core/store/content/includes';
import { getContentPagelet } from 'ish-core/store/content/pagelets';
import { getContentPageLoading, getSelectedContentPage } from 'ish-core/store/content/pages';
import { getPGID } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';
import { SfeMapper } from 'ish-shared/cms/sfe-adapter/sfe.mapper';

@Injectable({ providedIn: 'root' })
export class CMSFacade {
  contentPage$ = this.store.pipe(select(getSelectedContentPage));
  contentPageLoading$ = this.store.pipe(select(getContentPageLoading));

  constructor(private store: Store<{}>, private sfeAdapter: SfeAdapterService) {}

  contentInclude$(includeId$: Observable<string>) {
    return this.store.pipe(select(getPGID)).pipe(
      switchMapTo(includeId$),
      whenTruthy(),
      tap(includeId => this.store.dispatch(new LoadContentInclude({ includeId }))),
      switchMap(includeId => this.store.pipe(select(getContentInclude, includeId)))
    );
  }

  contentIncludeSfeMetadata$(includeId: string) {
    return this.store.pipe(select(getContentInclude, includeId)).pipe(
      filter(() => this.sfeAdapter.isInitialized()),
      whenTruthy(),
      map(include => SfeMapper.mapIncludeViewToSfeMetadata(include))
    );
  }

  pagelet$(id: string) {
    return this.store.pipe(select(getContentPagelet(), id));
  }
}
