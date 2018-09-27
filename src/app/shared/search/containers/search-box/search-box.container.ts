import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { SuggestSearch, getSearchTerm, getSuggestSearchResults } from '../../../../shopping/store/search';
import { SearchBoxConfiguration } from '../../configurations/search-box.configuration';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses {@link SearchBoxComponent} to display search box
 *
 * @example
 * <ish-search-box-container [placeholderText]="'search.searchbox.instructional_text' | translate"></ish-search-box-container>
 */
@Component({
  selector: 'ish-search-box-container',
  templateUrl: './search-box.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxContainerComponent {
  /**
   * the configuration for this component
   */
  @Input()
  configuration?: SearchBoxConfiguration;

  searchResults$ = this.store.pipe(select(getSuggestSearchResults));
  previousSearchTerm$ = this.store.pipe(select(getSearchTerm));

  constructor(private store: Store<{}>, private router: Router) {}

  suggestSearch(term: string) {
    this.store.dispatch(new SuggestSearch(term));
  }

  performSearch(searchTerm: string) {
    this.router.navigate(['/search', searchTerm]);
  }
}
