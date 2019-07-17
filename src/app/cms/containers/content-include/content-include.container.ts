// tslint:disable:ccp-no-intelligence-in-components
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, startWith, takeUntil } from 'rxjs/operators';

import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-views';
import { LoadContentInclude, getContentInclude } from 'ish-core/store/content/includes';
import { getPGID } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { SfeAdapterService } from '../../sfe-adapter/sfe-adapter.service';
import { SfeMetadataWrapper } from '../../sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../sfe-adapter/sfe.mapper';

/**
 * The Content Include Container Component renders the content of the include with the given 'includeId'.
 * For rendering is uses the {@link ContentPageletContainerComponent} for each sub pagelet.
 *
 * @example
 * <ish-content-include includeId="pwa.include.homepage.pagelet2-Include"></ish-content-include>
 */
@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIncludeContainerComponent extends SfeMetadataWrapper implements OnInit, OnDestroy, OnChanges {
  /**
   * The ID of the Include whoes content is to be rendered.
   */
  @Input() includeId: string;

  contentInclude$: Observable<ContentPageletEntryPointView>;

  private destroy$ = new Subject();

  private includeIdChange = new Subject<string>();

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

    /**
     * trigger loading of content include whenever id or pgid changes
     */
    const filteredIncludeIdChange$ = this.includeIdChange.pipe(
      startWith(this.includeId),
      whenTruthy(),
      distinctUntilChanged()
    );
    const pgidChange$ = this.store.pipe(select(getPGID));
    combineLatest([filteredIncludeIdChange$, pgidChange$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([includeId]) => {
        this.store.dispatch(new LoadContentInclude({ includeId }));
      });
  }

  // TODO: replace with @ObservableInput
  ngOnChanges(changes: SimpleChanges) {
    if (changes.includeId) {
      this.includeIdChange.next(this.includeId);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
