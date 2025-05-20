import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject, map, shareReplay } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { IconModule } from 'ish-core/icon.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SearchBoxConfiguration } from 'ish-core/models/search-box-configuration/search-box-configuration.model';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { PipesModule } from 'ish-core/pipes.module';
import { SuggestBrandsComponent } from 'ish-shared/components/search/suggest-brands/suggest-brands.component';
import { SuggestCategoriesComponent } from 'ish-shared/components/search/suggest-categories/suggest-categories.component';
import { SuggestKeywordsComponent } from 'ish-shared/components/search/suggest-keywords/suggest-keywords.component';
import { SuggestProductsComponent } from 'ish-shared/components/search/suggest-products/suggest-products.component';
import { SuggestSearchTermsComponent } from 'ish-shared/components/search/suggest-search-terms/suggest-search-terms.component';

/**
 * The SearchBoxComponent is responsible for handling the search box functionality,
 * including managing the search input, handling focus and blur events, and interacting
 * with the shopping facade to fetch search suggestions and results.
 *
 * @remarks
 * This component uses Angular's lifecycle hooks to initialize and manage the search box.
 * It also listens to various events such as transition end and window scroll to handle
 * the search box's behavior appropriately.
 *
 * @example
 * <app-search-box [configuration]="searchBoxConfig"></app-search-box>
 *
 * @publicApi
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
    SuggestBrandsComponent,
    SuggestCategoriesComponent,
    SuggestKeywordsComponent,
    SuggestProductsComponent,
    SuggestSearchTermsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * the search box configuration for this component
   */
  @Input() configuration: SearchBoxConfiguration;
  @Input() deviceType: DeviceType;

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;

  searchSuggestLoading$: Observable<boolean>;
  searchSuggestError$: Observable<HttpError>;

  inputSearchTerms$ = new ReplaySubject<string>(1);
  suggestions$: Observable<Suggestions>;

  // check if suggest has results to show the suggest layer
  searchBoxResults$: Observable<boolean>;

  // check if there are recent searched terms
  searchedTerms$: Observable<boolean>;

  // check if the input search term has more than 3 characters
  hasMinimumCharCount$: Observable<boolean>;

  // searchbox focus handling
  searchBoxFocus = false;
  searchBoxScaledUp = false;
  private searchBoxInitialWidth: number;

  // search suggest layer height
  private resizeTimeout: ReturnType<typeof setTimeout>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get usedIcon(): IconName {
    return this.configuration?.icon || 'search';
  }

  ngOnInit() {
    this.searchSuggestLoading$ = this.shoppingFacade.searchSuggestLoading$;
    this.searchSuggestError$ = this.shoppingFacade.searchSuggestError$;

    // suggests are triggered solely via stream
    this.suggestions$ = this.shoppingFacade
      .suggestResults$(this.inputSearchTerms$)
      .pipe(shareReplay(1)) as Observable<Suggestions>;

    this.searchBoxResults$ = this.suggestions$.pipe(
      map(
        results =>
          !!(
            results &&
            (results.keywords?.length ||
              results.categories?.length ||
              results.brands?.length ||
              results.products?.length)
          )
      ),
      shareReplay(1)
    );

    this.searchedTerms$ = this.shoppingFacade.recentSearchTerms$.pipe(
      map(terms => terms.length > 0),
      shareReplay(1)
    );

    this.hasMinimumCharCount$ = this.inputSearchTerms$.pipe(
      map(value => value.length > 2),
      shareReplay(1)
    );
  }

  ngAfterViewInit() {
    this.searchBoxInitialWidth = this.searchBox.nativeElement.offsetWidth;
  }

  ngOnDestroy() {
    clearTimeout(this.resizeTimeout);
  }

  // add event listener for transition end to check if search box has scaled up
  // to show the suggest layer only if the input has scaled up
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

  // if searchbox has focus - scale down and remove focus when scrolling the document
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.searchBoxFocus) {
      this.blur();
    }
  }

  // reset input when ESC key is pressed and element is focused within the search box
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.searchBox.nativeElement.contains(event.target)) {
      event.preventDefault(); // Optional: Prevent default behavior
      this.resetInput();
    }
  }

  // remove focus when clicking outside the search box
  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: undefined): void {
    this.blurIfOutside(targetElement);
  }

  // remove focus when focused outside the search box
  @HostListener('document:focusin', ['$event.target'])
  onFocusIn(targetElement: undefined): void {
    this.blurIfOutside(targetElement);
  }

  // check if the target element is outside the search box
  private blurIfOutside(targetElement: undefined): void {
    const clickedOrFocusedInside = this.searchBox.nativeElement.contains(targetElement);
    if (!clickedOrFocusedInside) {
      this.blur();
    }
  }

  // simple blur method to remove focus from search input
  private blur() {
    this.handleFocus(false);
    this.searchInput.nativeElement.blur();
  }

  // handle focus status of search box
  handleFocus(scaleUp: boolean) {
    this.updateMobileSuggestLayerHeight();

    if (scaleUp) {
      this.searchBoxFocus = true;
      // this.searchBoxScaledUp is set using transitionend event
    } else {
      this.searchBoxFocus = false;
      this.searchBoxScaledUp = false;
    }
  }

  // manually set focus on search input
  // the explicit function call in the component is needed to get the focus working in iOS devices
  setFocusOnSearchInput() {
    this.searchInput.nativeElement.focus();
  }

  // handle the user input
  handleInput(source: EventTarget) {
    const inputValue = (source as HTMLInputElement).value;
    this.inputSearchTerms$.next(inputValue);
    if (inputValue === '') {
      // clear suggestions in state when input is set to empty
      this.shoppingFacade.clearSuggestSearchSuggestions();
    }
  }

  // reset all and blur the input
  resetInput() {
    this.blur();
    this.inputSearchTerms$.next('');
    this.shoppingFacade.clearSuggestSearchSuggestions();
  }

  // handle the reset button
  handleResetButton(event: Event) {
    event.stopPropagation(); // important to prevent any other event listeners from firing
    this.inputSearchTerms$.next('');
    this.shoppingFacade.clearSuggestSearchSuggestions();
  }

  // submit the search form
  submitSearch(suggestedTerm: string) {
    if (!suggestedTerm) {
      this.setFocusOnSearchInput();
      return false;
    }

    // add the suggested term to the input field
    this.inputSearchTerms$.next(suggestedTerm);

    this.router.navigate(['/search', suggestedTerm]);
    this.blur();
    return false; // prevent form submission
  }

  // set CSS variable for suggest layer height on mobile devices to prevent keyboard overlay issues
  private updateMobileSuggestLayerHeight = () => {
    if (!SSR && this.deviceType === 'mobile') {
      clearTimeout(this.resizeTimeout);

      // timeout to wait for keyboard animation to finish
      this.resizeTimeout = setTimeout(() => {
        const remainingHeight = window.visualViewport?.height || window.innerHeight;
        this.document.documentElement.style.setProperty('--viewport-remaining-height', `${remainingHeight}px`);
      }, 300);
    }
  };
}
