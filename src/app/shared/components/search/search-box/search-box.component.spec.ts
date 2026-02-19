import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject, Subject, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';

import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let element: HTMLElement;
  let searchResults$: Subject<Suggestions>;
  let searchTerm$: Subject<string>;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);

    when(shoppingFacade.suggestResults$).thenReturn(() => searchResults$);
    when(shoppingFacade.searchTerm$).thenReturn(searchTerm$);
    when(shoppingFacade.recentSearchTerms$).thenReturn(new ReplaySubject<string[]>(1));
    when(shoppingFacade.searchSuggestLoading$).thenReturn(of(false));

    searchResults$ = new ReplaySubject(1);
    searchTerm$ = new ReplaySubject(1);
    searchResults$.next(undefined);
    searchTerm$.next(undefined);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
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

      const ul = fixture.nativeElement.querySelector('.search-suggest-terms ul');
      expect(ul.querySelectorAll('li')).toHaveLength(2);
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
