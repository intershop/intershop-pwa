import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SearchBoxConfiguration } from 'ish-core/models/search-box-configuration/search-box-configuration.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

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
@GenerateLazyComponent()
export class SearchBoxComponent implements OnInit, OnDestroy {
  /**
   * the search box configuration for this component
   */
  @Input() configuration?: SearchBoxConfiguration;

  searchResults$: Observable<SuggestTerm[]>;
  inputSearchTerms$ = new ReplaySubject<string>(1);

  activeIndex = -1;
  inputFocused: boolean;

  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  get usedIcon(): IconName {
    return this.configuration?.icon || 'search';
  }

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

  searchSuggest(source: string | EventTarget) {
    this.inputSearchTerms$.next(typeof source === 'string' ? source : (source as HTMLDataElement).value);
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
