/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { ReplaySubject, Subject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { SuggestBrandsComponent } from 'ish-shared/components/search/suggest-brands/suggest-brands.component';
import { SuggestCategoriesComponent } from 'ish-shared/components/search/suggest-categories/suggest-categories.component';
import { SuggestKeywordsComponent } from 'ish-shared/components/search/suggest-keywords/suggest-keywords.component';
import { SuggestProductsComponent } from 'ish-shared/components/search/suggest-products/suggest-products.component';
import { SuggestSearchTermsComponent } from 'ish-shared/components/search/suggest-search-terms/suggest-search-terms.component';

import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let element: HTMLElement;
  let searchResults$: Subject<Suggestions>;
  let searchTerm$: Subject<string>;
  let searchSuggestLoading$: Subject<boolean>;
  let searchServerError$: Subject<undefined>;
  let recentSearchTerms$: Subject<string[]>;

  beforeEach(async () => {
    searchResults$ = new ReplaySubject(1);
    searchTerm$ = new ReplaySubject(1);
    searchSuggestLoading$ = new ReplaySubject(1);
    searchServerError$ = new ReplaySubject(1);
    recentSearchTerms$ = new ReplaySubject(1);

    searchResults$.next(undefined);
    searchTerm$.next(undefined);
    searchSuggestLoading$.next(false);
    searchServerError$.next(undefined);
    recentSearchTerms$.next([]);

    await TestBed.configureTestingModule({
      imports: [
        MockComponent(SuggestBrandsComponent),
        MockComponent(SuggestCategoriesComponent),
        MockComponent(SuggestKeywordsComponent),
        MockComponent(SuggestProductsComponent),
        MockComponent(SuggestSearchTermsComponent),
        SearchBoxComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ShoppingFacade,
          useFactory: () =>
            ({
              suggestResults$: () => searchResults$,
              searchTerm$,
              recentSearchTerms$,
              searchSuggestLoading$,
              searchServerError$,
            } as Partial<ShoppingFacade>),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    // activate
    component.searchBoxFocus = true;
    component.configuration = { maxAutoSuggests: 4, autoSuggest: true };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with no results', () => {
    beforeEach(() => {
      searchResults$.next(undefined);
    });

    it('should show no results when no suggestions are found', () => {
      fixture.detectChanges();

      const ul = element.querySelector('.search-suggest-terms ul');
      expect(ul).toBeFalsy();
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      searchResults$.next({
        keywords: [{ keyword: 'Cameras' }, { keyword: 'Camcorders' }],
        products: [],
        categories: [],
        brands: [],
        contentSuggestions: [],
      } as Suggestions);
    });

    it('should show results when suggestions are available', () => {
      component.searchBoxFocus = true;
      component.inputSearchTerms$.next('cam');
      fixture.detectChanges();

      expect(element.querySelector('ish-suggest-keywords')).toBeTruthy();
    });

    it('should show no results when suggestions are available', () => {
      component.searchBoxFocus = false;
      fixture.detectChanges();

      expect(element.querySelector('.search-suggest-container')).toBeFalsy();
    });

    it('should show results when input is 3 or more characters', () => {
      component.searchBoxFocus = true;
      component.inputSearchTerms$.next('cam');
      fixture.detectChanges();

      expect(element.querySelector('ish-suggest-keywords')).toBeTruthy();
    });
  });

  describe('with inputs', () => {
    it('should show searchTerm when on search page', () => {
      component.searchBoxFocus = true;
      component.inputSearchTerms$.next('search');

      fixture.detectChanges();
      const input = element.querySelector('input');
      expect(input.value).toContain('search');
    });

    it('should show button text when buttonText is set', () => {
      component.configuration = { buttonText: 'buttonTextInput' };

      fixture.detectChanges();
      const button = element.querySelector('.btn-search');
      expect(button.textContent).toContain('buttonTextInput');
    });

    it('should show placeholder text when placeholder is set', () => {
      component.configuration = { placeholder: 'placeholderInput' };

      fixture.detectChanges();
      const inputElement = element.querySelector('.searchTerm');
      expect(inputElement.getAttribute('placeholder')).toBe('placeholderInput');
    });
  });
});
