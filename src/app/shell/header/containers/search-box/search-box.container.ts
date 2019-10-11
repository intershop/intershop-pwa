import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { SearchBoxConfiguration } from 'ish-shell/header/configurations/search-box.configuration';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses {@link SearchBoxComponent} to display the search box
 *
 * @example
 * <ish-search-box-container [configuration]="{placeholder: 'search.searchbox.instructional_text' | translate}"></ish-search-box-container>
 */
@Component({
  selector: 'ish-search-box-container',
  templateUrl: './search-box.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxContainerComponent implements OnInit {
  /**
   * the search box configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;

  previousSearchTerm$: Observable<string>;
  suggestSearchTerm$: Observable<string>;
  currentSearchBoxId$: Observable<string>;
  searchResults$: Observable<SuggestTerm[]>;
  searchResultsToDisplay$: Observable<SuggestTerm[]>;

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  ngOnInit() {
    this.suggestSearchTerm$ = this.shoppingFacade.suggestSearchTerm$;
    this.currentSearchBoxId$ = this.shoppingFacade.currentSearchBoxId$;
    this.searchResults$ = this.shoppingFacade.searchResults$;

    this.previousSearchTerm$ = this.shoppingFacade.searchTerm$.pipe(
      filter(() => this.configuration && this.configuration.showLastSearchTerm),
      distinctUntilChanged()
    );
    this.searchResultsToDisplay$ = this.searchResults$.pipe(
      withLatestFrom(this.currentSearchBoxId$),
      filter(([, id]) => !this.configuration || !this.configuration.id || this.configuration.id === id),
      map(([hits]) => hits)
    );
  }

  suggestSearch(term: string) {
    this.shoppingFacade.suggestSearch(term, this.configuration && this.configuration.id);
  }

  performSearch(searchTerm: string) {
    this.router.navigate(['/search', searchTerm]);
  }
}
