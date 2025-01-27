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
import { Observable, ReplaySubject, map } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { IconModule } from 'ish-core/icon.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
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
 * @property {boolean} inputFocused - Indicates whether the search input is focused.
 *
 * @method blur - Handles the blur event of the search input.
 * @method focus - Handles the focus event of the search input.
 * @method searchSuggest - Emits a new search term to trigger suggestions.
 * @method submitSearch - Submits the selected or entered search term.
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
export class AdvancedSearchBoxComponent implements OnInit, AfterViewInit {
  /**
   * the search box configuration for this component
   */
  @Input() configuration: SearchBoxConfiguration;

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchInputReset') searchInputReset: ElementRef;
  @ViewChild('searchInputSubmit') searchInputSubmit: ElementRef;
  @ViewChild('searchSuggestLayer') searchSuggestLayer: ElementRef;

  searchResults$: Observable<string[]>;
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
    // initialize with searchTerm when on search route
    this.shoppingFacade.searchTerm$
      .pipe(
        map(x => (x ? x : '')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => this.inputSearchTerms$.next(term));

    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade.searchResults$(this.inputSearchTerms$) as Observable<string[]>;

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

  isElementWithinSearchSuggestLayer(element: HTMLElement): boolean {
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

  handleEscKey() {
    this.blur();
    this.inputSearchTerms$.next('');
  }

  handleReset() {
    this.searchInput.nativeElement.focus(); // manually set focus to input to prevent blur event
    this.inputSearchTerms$.next('');
  }

  searchSuggest(source: EventTarget) {
    const inputValue = (source as HTMLInputElement).value;
    this.inputSearchTerms$.next(inputValue);
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

  truncate(text: string, limit: number): string {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  }
}
