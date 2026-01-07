import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { HtmlEncodePipe } from 'ish-core/pipes/html-encode.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';

/**
 * The Search No Result Component informs the user that no result has been found for his search and provides an input field for a new search.
 * It uses the {@link SearchBoxComponent}.
 *
 * @example
 * <ish-search-no-result [searchTerm]="searchTerm" />
 */
@Component({
  selector: 'ish-search-no-result',
  templateUrl: './search-no-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    BreadcrumbComponent,
    TranslateModule,
    SearchBoxComponent,
    ServerHtmlDirective,
    HtmlEncodePipe,
  ],
})
export class SearchNoResultComponent {
  /**
   * The search term leading to no result.
   */
  @Input({ required: true }) searchTerm: string;
}
