import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

interface SearchBoxConfiguration {
  /**
   * text for search button on search box, icon is used if no text is provided
   */
  buttonText?: string;
  /**
   * placeholder text for search input field
   */
  placeholder?: string;
  /**
   * if autoSuggest is set to true auto suggestion is provided for search box, else no auto suggestion is provided
   */
  autoSuggest?: boolean;
  /**
   * configures the number of suggestions if auto suggestion is provided
   */
  maxAutoSuggests?: number;
  /**
   * configure search box icon
   */
  icon?: IconProp;
  /**
   * show last search term as search box value
   */
  showLastSearchTerm?: boolean;
}

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses input to display the search box
 *
 * @example
 * <ish-search-box [configuration]="{placeholder: 'search.searchbox.instructional_text' | translate}"></ish-search-box>
 */
@Component({
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  /**
   * the search box configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;

  searchResults$: Observable<SuggestTerm[]>;
  inputSearchTerms$ = new ReplaySubject<string>(1);

  activeIndex = -1;
  inputFocused: boolean;

  defaultIcon: IconProp = 'search';

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  ngOnInit() {
    // initialize with searchTerm when on search route
    this.shoppingFacade.searchTerm$
      .pipe(
        map(x => (x ? x : '')),
        takeUntil(this.destroy$)
      )
      .subscribe(term => this.inputSearchTerms$.next(term));

    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade.searchResults$(this.inputSearchTerms$);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  blur() {
    this.inputFocused = false;
    this.activeIndex = -1;
  }

  focus() {
    this.inputFocused = true;
  }

  searchSuggest(searchTerm: string) {
    this.inputSearchTerms$.next(searchTerm);
  }

  submitSearch(suggestedTerm: string) {
    if (!suggestedTerm) {
      return false;
    }

    // remove focus when switching to search page
    this.inputFocused = false;

    if (this.activeIndex !== -1) {
      // something was selected via keyboard
      this.searchResults$.pipe(take(1), takeUntil(this.destroy$)).subscribe(results => {
        this.router.navigate(['/search', results[this.activeIndex].term]);
      });
    } else {
      this.router.navigate(['/search', suggestedTerm]);
    }

    // prevent form submission
    return false;
  }

  selectSuggestedTerm(index: number) {
    this.searchResults$.pipe(take(1), takeUntil(this.destroy$)).subscribe(results => {
      if (
        (this.configuration && this.configuration.maxAutoSuggests && index > this.configuration.maxAutoSuggests - 1) ||
        index < -1 ||
        index > results.length - 1
      ) {
        return;
      }
      this.activeIndex = index;
    });
  }
}
