import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { SfeMetadataWrapper } from 'ish-shared/cms/sfe-adapter/sfe-metadata-wrapper';

/**
 * The Content Include Container Component renders the content of the include with the given 'includeId'.
 * For rendering is uses the {@link ContentPageletContainerComponent} for each sub pagelet.
 *
 * @example
 * <ish-content-include includeId="pwa.include.homepage.pagelet2-Include"></ish-content-include>
 */
@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:ccp-no-intelligence-in-components
export class ContentIncludeComponent extends SfeMetadataWrapper implements OnInit, OnDestroy, OnChanges {
  /**
   * The ID of the Include whoes content is to be rendered.
   */
  @Input() includeId: string;

  contentInclude$: Observable<ContentPageletEntryPointView>;

  private destroy$ = new Subject();
  private includeIdChange = new ReplaySubject<string>(1);

  constructor(private cmsFacade: CMSFacade, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.contentInclude$ = this.cmsFacade.contentInclude$(this.includeIdChange);

    this.cmsFacade
      .contentIncludeSfeMetadata$(this.includeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(metadata => {
        this.setSfeMetadata(metadata);
        this.cd.markForCheck();
      });
  }

  // TODO: replace with @ObservableInput
  ngOnChanges() {
    this.includeIdChange.next(this.includeId);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
