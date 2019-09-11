import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';

import {
  SuggestSearch,
  getCurrentSearchBoxId,
  getSearchTerm,
  getSuggestSearchResult,
  getSuggestSearchTerm,
} from 'ish-core/store/shopping/search';
import { SearchBoxConfiguration } from 'ish-shell/header/configurations/search-box.configuration';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses {@link SearchBoxComponent} to display the search box
 *
 * @example
 * <ish-search-box-container [configuration]="{placeholderText: 'search.searchbox.instructional_text' | translate}"></ish-search-box-container>
 */
@Component({
  selector: 'ish-search-box-container',
  templateUrl: './search-box.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxContainerComponent {
  /**
   * the search box configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;

  previousSearchTerm$ = this.store.pipe(select(getSearchTerm)).pipe(
    filter(() => this.configuration && this.configuration.showLastSearchTerm),
    distinctUntilChanged()
  );
  suggestSearchTerm$ = this.store.pipe(select(getSuggestSearchTerm));
  currentSearchBoxId$ = this.store.pipe(select(getCurrentSearchBoxId));
  searchResults$ = this.store.pipe(select(getSuggestSearchResult));
  searchResultsToDisplay$ = this.searchResults$.pipe(
    withLatestFrom(this.currentSearchBoxId$),
    filter(([, id]) => !this.configuration || !this.configuration.id || this.configuration.id === id),
    map(([hits]) => hits)
  );

  constructor(private store: Store<{}>, private router: Router) {}

  suggestSearch(term: string) {
    this.store.dispatch(new SuggestSearch({ searchTerm: term, id: this.configuration && this.configuration.id }));
  }

  performSearch(searchTerm: string) {
    this.router.navigate(['/search', searchTerm]);
  }
}
