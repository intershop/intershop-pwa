// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { ContentEntryPointView } from 'ish-core/models/content-view/content-views';
import { LoadContentInclude, getContentInclude } from 'ish-core/store/content/includes';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { SfeAdapterService } from '../../../cms/sfe-adapter/sfe-adapter.service';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../../cms/sfe-adapter/sfe.mapper';

@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIncludeContainerComponent extends SfeMetadataWrapper implements OnInit, OnDestroy {
  @Input() includeId: string;
  contentInclude$: Observable<ContentEntryPointView>;
  private destroy$ = new Subject();

  constructor(private store: Store<{}>, private cd: ChangeDetectorRef, private sfeAdapter: SfeAdapterService) {
    super();
  }

  ngOnInit() {
    this.contentInclude$ = this.store.pipe(select(getContentInclude, this.includeId));

    this.contentInclude$
      .pipe(
        filter(() => this.sfeAdapter.isInitialized()),
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(include => {
        this.setSfeMetadata(SfeMapper.mapIncludeViewToSfeMetadata(include));
        this.cd.markForCheck();
      });

    this.contentInclude$
      .pipe(
        take(1),
        whenFalsy()
      )
      .subscribe(() => this.store.dispatch(new LoadContentInclude({ includeId: this.includeId })));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
