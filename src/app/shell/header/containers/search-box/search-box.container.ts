import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, merge } from 'rxjs';
import { filter, first, map, shareReplay, withLatestFrom } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { SearchBoxConfiguration } from 'ish-shell/header/configurations/search-box.configuration';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses input to display the search box
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

  suggestSearchTerm$: Observable<string>;
  currentSearchBoxId$: Observable<string>;
  searchResults$: Observable<SuggestTerm[]>;
  searchResultsToDisplay$: Observable<SuggestTerm[]>;

  inputSearchTerms$ = new Subject<string>();
  allSearchTerms$: Observable<string>;

  isHidden = true;
  activeIndex = -1;
  formSubmitted = false;

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  ngOnInit() {
    this.suggestSearchTerm$ = this.shoppingFacade.suggestSearchTerm$;
    this.currentSearchBoxId$ = this.shoppingFacade.currentSearchBoxId$;
    this.searchResults$ = this.shoppingFacade.searchResults$;

    this.searchResultsToDisplay$ = this.searchResults$.pipe(
      withLatestFrom(this.currentSearchBoxId$),
      filter(([, id]) => !this.configuration || !this.configuration.id || this.configuration.id === id),
      map(([hits]) => hits)
    );

    this.allSearchTerms$ = merge(this.suggestSearchTerm$, this.inputSearchTerms$).pipe(shareReplay(1));
  }

  hidePopup() {
    this.isHidden = true;
    this.activeIndex = -1;
  }

  searchSuggest(searchTerm: string) {
    this.isHidden = !searchTerm;
    this.formSubmitted = false;
    this.inputSearchTerms$.next(searchTerm);

    this.shoppingFacade.suggestSearch(searchTerm, this.configuration && this.configuration.id);
  }

  submitSearch() {
    this.isHidden = true;
    this.formSubmitted = true;
    if (this.activeIndex > -1) {
      this.searchResultsToDisplay$.pipe(first()).subscribe(results => {
        this.inputSearchTerms$.next(results[this.activeIndex].term);
      });
    }

    this.allSearchTerms$
      .pipe(
        first(),
        whenTruthy()
      )
      .subscribe(term => {
        this.hidePopup();
        this.router.navigate(['/search', term]);
      });

    return false;
  }

  submitSuggestedTerm(suggestedTerm: string) {
    this.inputSearchTerms$.next(suggestedTerm);
    this.submitSearch();
  }

  selectSuggestedTerm(index: number) {
    this.searchResultsToDisplay$.pipe(first()).subscribe(results => {
      if (
        this.isHidden ||
        (this.configuration && this.configuration.maxAutoSuggests && index > this.configuration.maxAutoSuggests - 1) ||
        index < -1 ||
        index > results.length - 1
      ) {
        return;
      }
      this.activeIndex = index;
    });
  }

  isActiveSuggestedTerm(index: number) {
    return this.activeIndex === index;
  }
}
