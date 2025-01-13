import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject, map, take } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { IconModule } from 'ish-core/icon.module';
import { SearchBoxConfiguration } from 'ish-core/models/search-box-configuration/search-box-configuration.model';
import { PipesModule } from 'ish-core/pipes.module';

/**
 * @description
 * The `AdvancedSearchBoxComponent` is a standalone component that provides a search box with auto-suggest functionality.
 * It interacts with the `ShoppingFacade` to fetch search suggestions and handles user input to perform searches.
 *
 * @example
 * <app-advanced-search-box [configuration]="searchBoxConfig"></app-advanced-search-box>
 *
 * @property {SearchBoxConfiguration} configuration - The search box configuration for this component.
 * @property {Observable<SuggestTerm[]>} searchResults$ - An observable stream of search suggestions.
 * @property {ReplaySubject<string>} inputSearchTerms$ - A subject to emit search terms entered by the user.
 * @property {number} activeIndex - The index of the currently active suggestion.
 * @property {boolean} inputFocused - Indicates whether the search input is focused.
 *
 * @method blur - Handles the blur event of the search input.
 * @method focus - Handles the focus event of the search input.
 * @method searchSuggest - Emits a new search term to trigger suggestions.
 * @method submitSearch - Submits the selected or entered search term.
 * @method selectSuggestedTerm - Selects a suggested term based on the provided index.
 *
 * @constructor
 * @param {ShoppingFacade} shoppingFacade - The facade to interact with the shopping state.
 * @param {Router} router - The Angular router to navigate to the search results page.
 *
 * @getter usedIcon - Returns the icon to be used in the search box.
 *
 * @lifecycle ngOnInit - Initializes the component and sets up the necessary streams.
 */
@Component({
  selector: 'ish-advanced-search-box',
  templateUrl: './advanced-search-box.component.html',
  standalone: true,
  imports: [CommonModule, IconModule, PipesModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedSearchBoxComponent implements OnInit {
  /**
   * the search box configuration for this component
   */
  @Input() configuration: SearchBoxConfiguration;

  searchResults$: Observable<string[]>;
  inputSearchTerms$ = new ReplaySubject<string>(1);

  activeIndex = -1;
  inputFocused: boolean;

  private destroyRef = inject(DestroyRef);

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  get usedIcon(): IconName {
    return this.configuration?.icon || 'search';
  }

  ngOnInit() {
    // initialize with searchTerm when on search route
    this.shoppingFacade.searchTerm$
      .pipe(
        map(x => (x ? x : '')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => this.inputSearchTerms$.next(term));

    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade.searchResults$(this.inputSearchTerms$);
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
      this.searchResults$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(results => {
        this.router.navigate(['/search', results[this.activeIndex]]);
        this.activeIndex = -1;
      });
    } else {
      this.router.navigate(['/search', suggestedTerm]);
    }

    // prevent form submission
    return false;
  }

  selectSuggestedTerm(index: number) {
    this.searchResults$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(results => {
      if (
        (this.configuration?.maxAutoSuggests && index > this.configuration.maxAutoSuggests - 1) ||
        index < -1 ||
        index > results.length - 1
      ) {
        return;
      }
      this.activeIndex = index;
    });
  }
}
