import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { ContentDesignViewWrapperComponent } from 'ish-shared/cms/components/content-design-view-wrapper/content-design-view-wrapper.component';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';

/**
 * The Content Include Component renders the content of the include with the given 'includeId'.
 * For rendering it uses the {@link ContentPageletComponent} for each sub pagelet.
 *
 * @example
 * <ish-content-include includeId="pwa.include.homepage.pagelet2-Include" />
 */
@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ContentDesignViewWrapperComponent, ContentPageletComponent],
})
export class ContentIncludeComponent implements OnInit, OnChanges {
  @Input({ required: true }) includeId: string;

  contentInclude$: Observable<ContentPageletEntryPointView>;

  private includeIdChange$ = new ReplaySubject<string>(1);

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.contentInclude$ = this.cmsFacade.contentInclude$(this.includeIdChange$);
  }

  ngOnChanges() {
    this.includeIdChange$.next(this.includeId);
  }
}
