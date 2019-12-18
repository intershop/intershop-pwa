import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Search No Result Component informs the user that no result has been found for his search and provides an input field for a new search.
 * It uses the {@link SearchBoxContainerComponent}.
 *
 * @example
 * <ish-search-no-result
 *               [searchTerm]="searchTerm"
 * ></ish-search-no-result>
 */
@Component({
  selector: 'ish-search-no-result',
  templateUrl: './search-no-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchNoResultComponent {
  /**
   * The search term leading to no result.
   */
  @Input() searchTerm: string;
}
