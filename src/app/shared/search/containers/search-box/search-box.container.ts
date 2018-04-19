import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';
import { getSearchTerm, getSuggestSearchResults, SuggestSearch } from '../../../../shopping/store/search';
import { ShoppingState } from '../../../../shopping/store/shopping.state';

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
export class SearchBoxContainerComponent implements OnInit {
  /**
   * text for search button on search box, glyphicon is used if no text is provided
   */
  @Input() buttonText?: string;
  /**
   * placeholder text for search input field
   */
  @Input() placeholderText = '';
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  @Input() autoSuggest: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  @Input() maxAutoSuggests: number;

  searchResults$: Observable<SuggestTerm[]>;
  previousSearchTerm$: Observable<string>;

  constructor(private store: Store<ShoppingState>, private router: Router) {}

  ngOnInit() {
    this.searchResults$ = this.store.pipe(select(getSuggestSearchResults));
    this.previousSearchTerm$ = this.store.pipe(select(getSearchTerm));
  }

  suggestSearch(term: string) {
    this.store.dispatch(new SuggestSearch(term));
  }

  performSearch(searchTerm: string) {
    this.router.navigate(['/search', searchTerm]);
  }
}
