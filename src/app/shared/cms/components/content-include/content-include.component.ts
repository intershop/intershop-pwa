import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Content Include Component renders the content of the include with the given 'includeId'.
 * For rendering it uses the {@link ContentPageletComponent} for each sub pagelet.
 *
 * @example
 * <ish-content-include includeId="pwa.include.homepage.pagelet2-Include"></ish-content-include>
 * or with lazy loading within the application shell
 * <ish-lazy-content-include includeId="include.footer.pagelet2-Include"></ish-lazy-content-include>
 */
@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ContentIncludeComponent implements OnInit, OnChanges {
  @Input() includeId: string;

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
