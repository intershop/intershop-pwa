import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject, shareReplay } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { IconModule } from 'ish-core/icon.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SearchBoxConfiguration } from 'ish-core/models/search-box-configuration/search-box-configuration.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { PipesModule } from 'ish-core/pipes.module';
import { SuggestBrandsTileComponent } from 'ish-core/standalone/component/suggest/suggest-brands-tile/suggest-brands-tile.component';
import { SuggestCategoriesTileComponent } from 'ish-core/standalone/component/suggest/suggest-categories-tile/suggest-categories-tile.component';
import { SuggestKeywordsTileComponent } from 'ish-core/standalone/component/suggest/suggest-keywords-tile/suggest-keywords-tile.component';
import { SuggestProductsTileComponent } from 'ish-core/standalone/component/suggest/suggest-products-tile/suggest-products-tile.component';

/**
 * @description
 * The `SearchBoxComponent` is a standalone component that provides a search box with auto-suggest functionality.
 * It interacts with the `ShoppingFacade` to fetch search suggestions and handles user input to perform searches.
 *
 * @example
 * <ish-search-box [configuration]="searchBoxConfig"></ish-search-box>
 *
 * @property {SearchBoxConfiguration} configuration - The search box configuration for this component.
 * @property {Observable<Suggestion>} searchResults$ - An observable stream of search suggestions.
 * @property {ReplaySubject<string>} inputSearchTerms$ - A subject to emit search terms entered by the user.
 * @property {Observable<boolean>} searchSuggestLoading$ - An observable stream indicating the loading state of search suggestions.
 * @property {Observable<HttpError>} searchSuggestError$ - An observable stream of errors that occur during search suggestions.
 * @property {boolean} searchBoxFocus - Indicates whether the search box is focused.
 * @property {boolean} searchBoxScaledUp - Indicates whether the search box has scaled up.
 * @property {boolean} isTabOut - Indicates whether the browser tab is out of focus.
 *
 * @method blur - Handles the blur event of the search input.
 * @method handleBlur - Handles the blur event of the search input with additional logic.
 * @method handleFocus - Handles the focus event of the search input.
 * @method reset - Reset and clear the search input and suggestions.
 * @method handleReset - Handles the reset event to clear the search input and suggestions.
 * @method searchSuggest - Emits a new search term to trigger suggestions.
 * @method submitSearch - Submits the selected or entered search term.
 * @method isElementWithinSearchSuggestLayer - Checks if the given element is within the search suggest layer.
 *
 * @constructor
 * @param {ShoppingFacade} shoppingFacade - The facade to interact with the shopping state.
 * @param {Router} router - The Angular router to navigate to the search results page.
 *
 * @getter hasMoreThanTwoCharacters - Returns true if the input search term has more than 2 characters.
 *
 * @lifecycle ngOnInit - Initializes the component and sets up the necessary streams.
 * @lifecycle ngAfterViewInit - Handles additional initialization after the view has been initialized.
 */
@Component({
  selector: 'ish-search-box',
  templateUrl: './search-box.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    PipesModule,
    TranslateModule,
    SuggestKeywordsTileComponent,
    SuggestCategoriesTileComponent,
    SuggestBrandsTileComponent,
    SuggestProductsTileComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit, AfterViewInit {
  /**
   * the search box configuration for this component
   */
  @Input() configuration: SearchBoxConfiguration;

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchInputReset') searchInputReset: ElementRef;
  @ViewChild('searchInputSubmit') searchInputSubmit: ElementRef;
  @ViewChild('searchSuggestLayer') searchSuggestLayer: ElementRef;

  searchResults$: Observable<Suggestion>;
  inputSearchTerms$ = new ReplaySubject<string>(1);
  searchSuggestLoading$: Observable<boolean>;
  searchSuggestError$: Observable<HttpError>;

  // searchbox focus handling
  searchBoxFocus = false;
  private searchBoxInitialWidth: number;
  searchBoxScaledUp = false;

  // handle browser tab focus
  // not-dead-code
  isTabOut = false;

  private destroyRef = inject(DestroyRef);

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  ngOnInit() {
    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade
      .searchResults$(this.inputSearchTerms$)
      .pipe(shareReplay(1)) as Observable<Suggestion>;

    this.searchSuggestLoading$ = this.shoppingFacade.searchSuggestLoading$;
    this.searchSuggestError$ = this.shoppingFacade.searchSuggestError$;
  }

  ngAfterViewInit() {
    this.searchBoxInitialWidth = this.searchBox.nativeElement.offsetWidth;
  }

  @HostListener('transitionend', ['$event'])
  onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'width' && event.target === this.searchBox.nativeElement) {
      const newWidth = this.searchInput.nativeElement.offsetWidth;
      if (newWidth > this.searchBoxInitialWidth) {
        // check if search box has scaled up
        this.searchBoxScaledUp = true;
      } else {
        this.searchBoxScaledUp = false;
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.searchBoxFocus) {
      // if searchbox has focus - scale down and remove focus when scrolling the document
      this.blur();
    }
  }

  blur() {
    this.handleFocus(false);
    this.searchInput.nativeElement.blur();
  }

  handleBlur(event: FocusEvent) {
    if (!SSR) {
      if (!document.hasFocus()) {
        this.isTabOut = true;
        return; // skip handling blur if browser tab loses focus
      }
      this.isTabOut = false; // reset flag

      const currentElement = event.relatedTarget as HTMLElement;
      if (
        currentElement !== this.searchInput.nativeElement &&
        currentElement !== this.searchInputReset?.nativeElement &&
        currentElement !== this.searchInputSubmit.nativeElement &&
        !this.isElementWithinSearchSuggestLayer(currentElement)
      ) {
        this.handleFocus(false); // do not scale down if one of the searchbox elements is focused
      }
    }
  }

  private isElementWithinSearchSuggestLayer(element: HTMLElement): boolean {
    return this.searchSuggestLayer?.nativeElement.contains(element) ?? false;
  }

  handleFocus(scaleUp: boolean = true) {
    if (scaleUp) {
      this.searchBoxFocus = true;
    } else {
      this.searchBoxFocus = false;
      this.searchBoxScaledUp = false;
    }
  }

  reset() {
    this.blur();
    this.inputSearchTerms$.next('');
    this.shoppingFacade.clearSuggestSearchSuggestions();
  }

  handleReset() {
    this.searchInput.nativeElement.focus(); // manually set focus to input to prevent blur event
    this.inputSearchTerms$.next('');
    this.shoppingFacade.clearSuggestSearchSuggestions();
  }

  searchSuggest(source: EventTarget) {
    const inputValue = (source as HTMLInputElement).value;
    this.inputSearchTerms$.next(inputValue);
    if (inputValue === '') {
      // clear suggestions in state when input is set to empty
      this.shoppingFacade.clearSuggestSearchSuggestions();
    }
  }

  submitSearch(suggestedTerm: string) {
    if (!suggestedTerm) {
      this.searchInput.nativeElement.focus();
      return false;
    }

    this.router.navigate(['/search', suggestedTerm]);

    this.blur();

    return false; // prevent form submission
  }

  // getter method to check if the input search term has more than 2 characters
  get hasMoreThanTwoCharacters(): boolean {
    let term = '';
    this.inputSearchTerms$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => (term = value));
    return term.length >= 2;
  }
}
