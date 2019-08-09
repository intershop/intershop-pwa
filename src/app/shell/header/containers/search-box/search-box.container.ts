import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';

import {
  SuggestSearch,
  getCurrentSearchboxId,
  getSearchTerm,
  getSuggestSearchResults,
} from 'ish-core/store/shopping/search';
import { SearchBoxConfiguration } from '../../configurations/search-box.configuration';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses {@link SearchBoxComponent} to display search box
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
   * the configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;

  previousSearchTerm$ = this.store.pipe(select(getSearchTerm));
  currentSearchboxId$ = this.store.pipe(select(getCurrentSearchboxId));
  searchResults$ = this.store.pipe(select(getSuggestSearchResults));
  searchResultsToDisplay$ = this.searchResults$.pipe(
    withLatestFrom(this.currentSearchboxId$),
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
